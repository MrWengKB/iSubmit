/**
 * iSubmit — 作业提交后端（Google Apps Script）
 *
 * 这个文件不需要修改：粘贴 → 运行一次 setup → 部署为网页应用即可。
 * 班级、学生名单、作业、口令等都在 admin.html 管理页面中设置，
 * 设置保存在你 Drive 的「iSubmit 作业提交/iSubmit 设置.json」中。
 *
 * 脚本以「你」的身份运行，学生没有任何 Drive 访问权限，看不到别人的作业。
 */

const ROOT_FOLDER_NAME = 'iSubmit 作业提交';

const DEFAULT_DATA = {
  settings: {
    accessCode: '',
    maxFileMB: 20,
    allowedExt: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'zip', 'txt',
                 'mp3', 'm4a', 'mp4', 'mov', 'm4v', 'avi'],
    allowLate: true,
  },
  classes: [],      // [{ id, name, students: ['张三', ...] }]
  assignments: [],  // [{ id, name, classIds: [...], deadline: ISO 字符串或 '', open: true }]
};

/** 部署前在编辑器里手动运行一次，完成授权 */
function setup() {
  Logger.log('作业文件夹：' + getRootFolder_().getUrl());
  Logger.log('Submission log: ' + getLogSheet_().getParent().getUrl());
  loadData_();
  Logger.log('完成。现在可以「部署 → 新建部署 → 网页应用」。');
}

function doGet() {
  return json_({ ok: true, service: 'iSubmit' });
}

function doPost(e) {
  let req;
  try { req = JSON.parse(e.postData.contents); }
  catch (err) { return json_({ ok: false, error: '请求格式错误' }); }

  try {
    switch (req.action) {
      // ---- 学生 ----
      case 'config':           return json_(publicConfig_(req));
      case 'submit':           return json_(submit_(req));
      // ---- 管理员 ----
      case 'adminStatus':      return json_({ ok: true, hasPassword: !!props_().getProperty('ADMIN_HASH') });
      case 'adminSetup':       return json_(adminSetup_(req));
      case 'adminGet':         requireAdmin_(req); return json_(adminGet_());
      case 'adminSave':        requireAdmin_(req); return json_(adminSave_(req.data));
      case 'adminSubmissions': requireAdmin_(req); return json_(adminSubmissions_(req.assignmentId));
      case 'adminPassword':    requireAdmin_(req); setPassword_(req.newPassword); return json_({ ok: true });
      default:                 return json_({ ok: false, error: '未知操作' });
    }
  } catch (err) {
    return json_({ ok: false, error: err.message, auth: !!err.auth });
  }
}


// ============================ 学生端 ============================

function publicConfig_(req) {
  const data = loadData_();
  const s = data.settings;
  if (s.accessCode && String(req.code || '').trim() !== s.accessCode) {
    return { ok: false, needsCode: true, error: req.code ? '口令不正确' : '' };
  }
  const now = new Date();
  return {
    ok: true,
    needsCode: !!s.accessCode,
    maxFileMB: s.maxFileMB,
    allowedExt: s.allowedExt,
    allowLate: s.allowLate,
    classes: data.classes.map(c => ({ id: c.id, name: c.name, students: c.students })),
    assignments: data.assignments.filter(a => a.open).map(a => ({
      id: a.id,
      name: a.name,
      classIds: a.classIds,
      deadline: a.deadline,
      closed: !!(a.deadline && now > new Date(a.deadline) && !s.allowLate),
    })),
  };
}

function submit_(req) {
  const data = loadData_();
  const s = data.settings;

  if (s.accessCode && String(req.code || '').trim() !== s.accessCode) fail_('提交口令不正确');

  const cls = data.classes.find(c => c.id === req.classId);
  if (!cls) fail_('请选择班级');

  const a = data.assignments.find(x => x.id === req.assignmentId && x.open);
  if (!a || a.classIds.indexOf(cls.id) === -1) fail_('作业不存在或未对该班级开放');

  const name = String(req.name || '');
  if (cls.students.indexOf(name) === -1) fail_('请从名单中选择你的名字');

  const now = new Date();
  const late = !!(a.deadline && now > new Date(a.deadline));
  if (late && !s.allowLate) fail_('该作业已过截止时间');

  const lock = LockService.getScriptLock();
  const safeName = clean_(name, 30);
  const stamp = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss');
  const latePrefix = late ? '[LATE]' : '';

  // ---- 提交链接（文件太大时，学生把文件放在自己的 Drive 再分享链接）----
  if (req.link != null) {
    const link = String(req.link).trim();
    if (!/^https?:\/\/[^\s<>"]+$/i.test(link) || link.length > 2000) fail_('请输入有效的链接（以 http:// 或 https:// 开头）');
    lock.waitLock(20000);
    try {
      const folder = assignmentFolder_(a, cls);
      const fileName = latePrefix + safeName + '_LINK_' + stamp + '.txt';
      const file = folder.createFile(fileName, link + '\n', 'text/plain');
      file.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);
      getLogSheet_().appendRow([now, a.name, cls.name, name, LINK_MARK, fileName, '', late ? LATE_MARK : '', link, a.id, cls.id]);
    } finally {
      lock.releaseLock();
    }
    return { ok: true, receipt: Utilities.getUuid().slice(0, 8).toUpperCase(), time: now.toISOString(), late: late };
  }

  // ---- 提交文件 ----
  const f = req.file || {};
  const origName = clean_(f.name, 120) || 'file';
  const ext = (origName.match(/\.([^.]+)$/) || [, ''])[1].toLowerCase();
  if (s.allowedExt.length && s.allowedExt.indexOf(ext) === -1) {
    fail_('不支持的文件类型：.' + (ext || '(无扩展名)'));
  }
  const bytes = Utilities.base64Decode(String(f.data || ''));
  if (!bytes.length) fail_('文件为空');
  if (bytes.length > s.maxFileMB * 1024 * 1024) fail_('文件超过 ' + s.maxFileMB + 'MB');

  lock.waitLock(20000);
  try {
    const folder = assignmentFolder_(a, cls);
    let fileName = safeName + '_' + origName;
    if (folder.getFilesByName(fileName).hasNext() || folder.getFilesByName('[LATE]' + fileName).hasNext()) {
      fileName = safeName + '_' + stamp + '_' + origName;   // 重复提交：保留旧文件
    }
    fileName = latePrefix + fileName;

    const file = folder.createFile(Utilities.newBlob(bytes, f.type || 'application/octet-stream', fileName));
    file.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);

    getLogSheet_().appendRow([
      now, a.name, cls.name, name, origName, fileName,
      Math.round(bytes.length / 1024), late ? LATE_MARK : '', file.getUrl(), a.id, cls.id,
    ]);
  } finally {
    lock.releaseLock();
  }

  return { ok: true, receipt: Utilities.getUuid().slice(0, 8).toUpperCase(), time: now.toISOString(), late: late };
}


// ============================ 管理端 ============================

function adminSetup_(req) {
  if (props_().getProperty('ADMIN_HASH')) fail_('管理密码已设置过');
  setPassword_(req.password);
  return { ok: true };
}

function setPassword_(pw) {
  pw = String(pw || '');
  if (pw.length < 6) fail_('密码至少 6 位');
  const salt = Utilities.getUuid();
  props_().setProperties({ ADMIN_SALT: salt, ADMIN_HASH: hash_(salt, pw) });
}

function requireAdmin_(req) {
  const p = props_();
  const h = p.getProperty('ADMIN_HASH');
  if (!h) { const e = new Error('尚未设置管理密码'); e.auth = true; throw e; }

  const cache = CacheService.getScriptCache();
  const fails = Number(cache.get('adminFail') || 0);
  if (fails >= 20) { const e = new Error('密码错误次数过多，请 10 分钟后再试'); e.auth = true; throw e; }

  if (hash_(p.getProperty('ADMIN_SALT'), String(req.password || '')) !== h) {
    cache.put('adminFail', String(fails + 1), 600);
    const e = new Error('管理密码不正确'); e.auth = true; throw e;
  }
}

function hash_(salt, pw) {
  return Utilities.base64Encode(
    Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + '|' + pw, Utilities.Charset.UTF_8));
}

function adminGet_() {
  return {
    ok: true,
    data: loadData_(),
    rootUrl: getRootFolder_().getUrl(),
    sheetUrl: getLogSheet_().getParent().getUrl(),
  };
}

function adminSave_(input) {
  const data = normalize_(input);
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    saveData_(data);
    // 名称改了的话，同步重命名已有的 Drive 文件夹
    const p = props_();
    data.classes.forEach(c => {
      const fc = folderFromProp_('FK_' + c.id);
      if (fc && fc.getName() !== c.name) fc.setName(c.name);
      data.assignments.forEach(a => {
        const fa = folderFromProp_('FW_' + c.id + '_' + a.id);
        if (fa && fa.getName() !== a.name) fa.setName(a.name);
      });
    });
  } finally {
    lock.releaseLock();
  }
  return { ok: true, data: data };
}

function adminSubmissions_(assignmentId) {
  const data = loadData_();
  const a = data.assignments.find(x => x.id === assignmentId);
  if (!a) fail_('作业不存在');

  const sheet = getLogSheet_();
  const rows = sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, 11).getValues() : [];
  const byKey = {};  // classId|name -> {count, last, late}
  rows.forEach(r => {
    if (r[9] !== a.id) return;
    const k = r[10] + '|' + r[3];
    const o = byKey[k] || (byKey[k] = { count: 0, last: null, late: false, links: [] });
    o.count++;
    if (r[4] === LINK_MARK || r[4] === '(链接)') o.links.push(String(r[8]));
    const t = new Date(r[0]);
    if (!o.last || t > o.last) o.last = t;
    if (r[7] === LATE_MARK || r[7] === '是') o.late = true;
  });

  return {
    ok: true,
    assignment: { id: a.id, name: a.name, deadline: a.deadline },
    classes: data.classes.filter(c => a.classIds.indexOf(c.id) !== -1).map(c => ({
      id: c.id,
      name: c.name,
      folderUrl: (f => f ? f.getUrl() : '')(folderFromProp_('FW_' + c.id + '_' + a.id)),
      students: c.students.map(n => {
        const o = byKey[c.id + '|' + n];
        return { name: n, count: o ? o.count : 0, last: o ? o.last.toISOString() : '', late: o ? o.late : false, links: o ? o.links : [] };
      }),
    })),
  };
}

/** 清洗管理页提交上来的数据 */
function normalize_(input) {
  input = input || {};
  const idOk = id => /^[A-Za-z0-9_-]{1,32}$/.test(String(id || ''));
  const s = input.settings || {};
  const settings = {
    accessCode: String(s.accessCode || '').trim().slice(0, 50),
    maxFileMB: Math.min(Math.max(Number(s.maxFileMB) || 20, 1), 35),
    allowedExt: (Array.isArray(s.allowedExt) ? s.allowedExt : [])
      .map(x => String(x).trim().replace(/^\./, '').toLowerCase()).filter(Boolean),
    allowLate: s.allowLate !== false,
  };

  const classes = [];
  (input.classes || []).forEach(c => {
    const name = clean_(c.name, 40);
    if (!idOk(c.id) || !name) return;
    const seen = {};
    const students = (c.students || []).map(n => String(n).replace(/[\u0000-\u001f]/g, '').trim().slice(0, 30))
      .filter(n => n && !seen[n] && (seen[n] = true));
    classes.push({ id: c.id, name: name, students: students });
  });
  const classIds = classes.map(c => c.id);

  const assignments = [];
  (input.assignments || []).forEach(a => {
    const name = clean_(a.name, 80);
    if (!idOk(a.id) || !name) return;
    let deadline = '';
    if (a.deadline) {
      const d = new Date(a.deadline);
      if (!isNaN(d)) deadline = d.toISOString();
    }
    assignments.push({
      id: a.id,
      name: name,
      classIds: (a.classIds || []).filter(id => classIds.indexOf(id) !== -1),
      deadline: deadline,
      open: a.open !== false,
    });
  });

  return { settings: settings, classes: classes, assignments: assignments };
}


// ============================ 存储 ============================

function props_() { return PropertiesService.getScriptProperties(); }

function loadData_() {
  const cache = CacheService.getScriptCache();
  const hit = cache.get('data');
  if (hit) return JSON.parse(hit);

  const file = getDataFile_();
  let data;
  try { data = JSON.parse(file.getBlob().getDataAsString('UTF-8')); } catch (e) { data = {}; }
  data = {
    settings: Object.assign({}, DEFAULT_DATA.settings, data.settings || {}),
    classes: data.classes || [],
    assignments: data.assignments || [],
  };
  try { cache.put('data', JSON.stringify(data), 600); } catch (e) { /* 太大就不缓存 */ }
  return data;
}

function saveData_(data) {
  getDataFile_().setContent(JSON.stringify(data, null, 2));
  CacheService.getScriptCache().remove('data');
}

function getDataFile_() {
  const p = props_();
  const id = p.getProperty('DATA_ID');
  if (id) { try { return DriveApp.getFileById(id); } catch (e) {} }
  const f = getRootFolder_().createFile('iSubmit 设置.json', JSON.stringify(DEFAULT_DATA, null, 2), 'application/json');
  p.setProperty('DATA_ID', f.getId());
  return f;
}

function getRootFolder_() {
  const p = props_();
  const id = p.getProperty('ROOT_ID');
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) {} }
  const it = DriveApp.getFoldersByName(ROOT_FOLDER_NAME);
  const folder = it.hasNext() ? it.next() : DriveApp.createFolder(ROOT_FOLDER_NAME);
  p.setProperty('ROOT_ID', folder.getId());
  return folder;
}

function folderFromProp_(key) {
  const id = props_().getProperty(key);
  if (!id) return null;
  try { return DriveApp.getFolderById(id); } catch (e) { return null; }
}

// Drive 结构：iSubmit 作业提交 / 班级 / 作业 / 文件
function classFolder_(c) {
  const key = 'FK_' + c.id;
  let f = folderFromProp_(key);
  if (!f) { f = getRootFolder_().createFolder(c.name); props_().setProperty(key, f.getId()); }
  return f;
}

function assignmentFolder_(a, c) {
  const key = 'FW_' + c.id + '_' + a.id;
  let f = folderFromProp_(key);
  if (!f) { f = classFolder_(c).createFolder(a.name); props_().setProperty(key, f.getId()); }
  return f;
}

const LOG_NAME = 'iSubmit Submission Log';
const LOG_HEADERS = ['Time', 'Assignment', 'Class', 'Name', 'Original file name', 'Saved as',
                     'Size (KB)', 'Late', 'File / link', 'Assignment ID', 'Class ID'];
const LINK_MARK = '(link)';
const LATE_MARK = 'Yes';

function getLogSheet_() {
  const p = props_();
  const id = p.getProperty('LOG_ID');
  if (id) {
    try {
      const ss = SpreadsheetApp.openById(id);
      const sh = ss.getSheets()[0];
      migrateLog_(ss, sh);
      return sh;
    } catch (e) {}
  }
  const ss = SpreadsheetApp.create(LOG_NAME);
  DriveApp.getFileById(ss.getId()).moveTo(getRootFolder_());
  const sh = ss.getSheets()[0];
  sh.appendRow(LOG_HEADERS);
  sh.setFrozenRows(1);
  p.setProperty('LOG_ID', ss.getId());
  return sh;
}

/** 旧版登记表（中文表名、表头）一次性改成英文 */
function migrateLog_(ss, sh) {
  if (sh.getRange(1, 1).getValue() !== '提交时间') return;
  sh.getRange(1, 1, 1, LOG_HEADERS.length).setValues([LOG_HEADERS]);
  ss.rename(LOG_NAME);
  const n = sh.getLastRow() - 1;
  if (n < 1) return;
  const linkCol = sh.getRange(2, 5, n, 1), lateCol = sh.getRange(2, 8, n, 1);
  linkCol.setValues(linkCol.getValues().map(r => [r[0] === '(链接)' ? LINK_MARK : r[0]]));
  lateCol.setValues(lateCol.getValues().map(r => [r[0] === '是' ? LATE_MARK : r[0]]));
}


// ============================ 工具 ============================

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function fail_(msg) { throw new Error(msg); }

function clean_(s, max) {
  return String(s || '').replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_').trim().slice(0, max);
}
