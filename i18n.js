// iSubmit 多语言：华文 / English / Bahasa Melayu / தமிழ்
// 每一行：键: [华文, English, Bahasa Melayu, தமிழ்]
(function () {
  const LANGS = [['zh', '华文'], ['en', 'English'], ['ms', 'Bahasa Melayu'], ['ta', 'தமிழ்']];
  const IDX = { zh: 0, en: 1, ms: 2, ta: 3 };
  const LOCALE = { zh: 'zh-CN', en: 'en-GB', ms: 'ms-MY', ta: 'ta-MY' };
  const HTML_LANG = { zh: 'zh-CN', en: 'en', ms: 'ms', ta: 'ta' };

  const D = {
    // ---------- 通用 ----------
    'lang.label': ['语言', 'Language', 'Bahasa', 'மொழி'],
    'loading': ['正在加载…', 'Loading…', 'Memuatkan…', 'ஏற்றுகிறது…'],
    'f.class': ['班级', 'Class', 'Kelas', 'வகுப்பு'],
    'f.name': ['姓名', 'Name', 'Nama', 'பெயர்'],
    'f.assignment': ['作业', 'Assignment', 'Tugasan', 'வீட்டுப்பாடம்'],
    'f.files': ['文件', 'Files', 'Fail', 'கோப்புகள்'],
    'pw.min': ['密码至少 6 位', 'Password must be at least 6 characters', 'Kata laluan mestilah sekurang-kurangnya 6 aksara', 'கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்'],

    // ---------- 学生提交页 ----------
    'title.submit': ['iSubmit · 作业提交', 'iSubmit · Homework Submission', 'iSubmit · Hantar Kerja Rumah', 'iSubmit · வீட்டுப்பாடம் சமர்ப்பிப்பு'],
    'app.subtitle': ['作业提交 · 文件只有老师能看到', 'Homework submission · Only your teacher can see your files', 'Penghantaran kerja rumah · Hanya guru boleh melihat fail anda', 'வீட்டுப்பாடம் சமர்ப்பிப்பு · உங்கள் கோப்புகளை ஆசிரியர் மட்டுமே பார்க்க முடியும்'],
    'code.label': ['提交口令', 'Submission code', 'Kod penghantaran', 'சமர்ப்பிப்புக் குறியீடு'],
    'code.hint': ['口令由老师在课上告知', 'Your teacher will give you the code in class', 'Guru akan memberitahu kod ini di dalam kelas', 'இந்தக் குறியீட்டை ஆசிரியர் வகுப்பில் தெரிவிப்பார்'],
    'btn.continue': ['继续', 'Continue', 'Teruskan', 'தொடரவும்'],
    'drop.click': ['点击选择', 'Click to choose', 'Klik untuk pilih', 'தேர்வு செய்ய சொடுக்கவும்'],
    'drop.or': ['或把文件拖到这里', 'or drag files here', 'atau seret fail ke sini', 'அல்லது கோப்புகளை இங்கே இழுத்து விடவும்'],
    'link.tip': ['文件太大？请存到自己的Google Drive再分享链接给我。', 'File too big? Save it to your own Google Drive and share the link with me.', 'Fail terlalu besar? Simpan dalam Google Drive anda sendiri, kemudian kongsi pautannya dengan saya.', 'கோப்பு மிகப் பெரியதா? அதை உங்கள் சொந்த Google Drive-இல் சேமித்து, இணைப்பை எனக்குப் பகிரவும்.'],
    'link.ph': ['粘贴分享链接，例如 https://drive.google.com/…', 'Paste the share link, e.g. https://drive.google.com/…', 'Tampal pautan kongsi, cth. https://drive.google.com/…', 'பகிர்வு இணைப்பை ஒட்டவும், எ.கா. https://drive.google.com/…'],
    'link.hint': ['分享时请把权限设为「知道链接的任何人都可以查看」，否则老师打不开。', 'When sharing, set access to "Anyone with the link can view", otherwise your teacher can\'t open it.', 'Semasa berkongsi, tetapkan akses kepada "Sesiapa sahaja yang mempunyai pautan boleh melihat", jika tidak guru tidak dapat membukanya.', 'பகிரும்போது அணுகலை "இணைப்பு உள்ள எவரும் பார்க்கலாம்" என அமைக்கவும்; இல்லையெனில் ஆசிரியரால் திறக்க முடியாது.'],
    'btn.submit': ['提交作业', 'Submit', 'Hantar', 'சமர்ப்பி'],
    'btn.submitting': ['正在提交…', 'Submitting…', 'Sedang menghantar…', 'சமர்ப்பிக்கிறது…'],
    'footer.deploy': ['部署自己的iSubmit', 'Deploy your own iSubmit', 'Pasang iSubmit anda sendiri', 'உங்கள் சொந்த iSubmit-ஐ அமைக்கவும்'],
    'footer': ['可以多次提交，之前的文件会保留。', 'You can submit more than once; earlier files are kept.', 'Anda boleh menghantar lebih daripada sekali; fail terdahulu akan disimpan.', 'நீங்கள் பலமுறை சமர்ப்பிக்கலாம்; முந்தைய கோப்புகள் வைத்திருக்கப்படும்.'],
    'e.notConfigured': ['提交服务尚未配置。', 'The submission service is not set up yet.', 'Perkhidmatan penghantaran belum disediakan.', 'சமர்ப்பிப்புச் சேவை இன்னும் அமைக்கப்படவில்லை.'],
    'e.notConfiguredHint': ['请老师在 config.js 中填写网址。', 'Teacher: please fill in the web address in config.js.', 'Guru: sila isi alamat web dalam config.js.', 'ஆசிரியர்: config.js-இல் இணைய முகவரியை நிரப்பவும்.'],
    'e.connect': ['无法连接提交服务，请稍后再试。', 'Cannot connect to the submission service. Please try again later.', 'Tidak dapat menyambung ke perkhidmatan penghantaran. Sila cuba lagi kemudian.', 'சமர்ப்பிப்புச் சேவையுடன் இணைக்க முடியவில்லை. பின்னர் மீண்டும் முயலவும்.'],
    'e.load': ['加载失败', 'Failed to load', 'Gagal dimuatkan', 'ஏற்ற முடியவில்லை'],
    'e.noClasses': ['老师还没有设置班级。', 'Your teacher hasn\'t set up any classes yet.', 'Guru belum menyediakan sebarang kelas.', 'ஆசிரியர் இன்னும் வகுப்புகளை அமைக்கவில்லை.'],
    'sel.class': ['请选择班级', 'Select your class', 'Pilih kelas anda', 'உங்கள் வகுப்பைத் தேர்ந்தெடுக்கவும்'],
    'sel.classFirst': ['请先选择班级', 'Select a class first', 'Pilih kelas dahulu', 'முதலில் வகுப்பைத் தேர்ந்தெடுக்கவும்'],
    'sel.name': ['请选择你的名字', 'Select your name', 'Pilih nama anda', 'உங்கள் பெயரைத் தேர்ந்தெடுக்கவும்'],
    'sel.noAssign': ['本班暂无开放的作业', 'No open assignments for this class', 'Tiada tugasan dibuka untuk kelas ini', 'இந்த வகுப்பிற்குத் திறந்த வீட்டுப்பாடம் இல்லை'],
    'sel.closed': ['（已截止）', ' (closed)', ' (ditutup)', ' (முடிந்தது)'],
    'dl.label': ['截止：{d}', 'Due: {d}', 'Tarikh akhir: {d}', 'கடைசி நாள்: {d}'],
    'dl.lateOk': [' · 已过截止时间，提交将标记为迟交', ' · Past the deadline; submissions will be marked late', ' · Tarikh akhir telah berlalu; penghantaran akan ditanda lewat', ' · கடைசி நாள் கடந்துவிட்டது; சமர்ப்பிப்பு தாமதமாகக் குறிக்கப்படும்'],
    'dl.closed': [' · 已截止', ' · Closed', ' · Ditutup', ' · முடிந்தது'],
    'lim.size': ['单个文件 ≤ {n} MB', 'Max {n} MB per file', 'Maksimum {n} MB setiap fail', 'ஒரு கோப்புக்கு அதிகபட்சம் {n} MB'],
    'lim.types': ['；支持 {list}', '; allowed: {list}', '; dibenarkan: {list}', '; அனுமதிக்கப்பட்டவை: {list}'],
    'f.badType': ['类型不支持', 'Type not allowed', 'Jenis tidak dibenarkan', 'வகை அனுமதிக்கப்படவில்லை'],
    'f.tooBig': ['超过 {n}MB', 'Over {n} MB', 'Melebihi {n} MB', '{n} MB-ஐ மீறுகிறது'],
    'f.empty': ['空文件', 'Empty file', 'Fail kosong', 'வெற்றுக் கோப்பு'],
    'f.remove': ['移除', 'Remove', 'Buang', 'நீக்கு'],
    'st.uploading': ['上传中…', 'Uploading…', 'Memuat naik…', 'பதிவேற்றுகிறது…'],
    'st.done': ['✓ 已提交', '✓ Submitted', '✓ Dihantar', '✓ சமர்ப்பிக்கப்பட்டது'],
    'st.failed': ['失败', 'Failed', 'Gagal', 'தோல்வி'],
    'e.readFile': ['读取文件失败', 'Could not read the file', 'Gagal membaca fail', 'கோப்பைப் படிக்க முடியவில்லை'],
    'v.pickAssign': ['请选择作业', 'Select an assignment', 'Pilih tugasan', 'வீட்டுப்பாடத்தைத் தேர்ந்தெடுக்கவும்'],
    'v.badLink': ['链接格式不正确，应以 https:// 开头', 'Invalid link. It should start with https://', 'Pautan tidak sah. Ia mesti bermula dengan https://', 'தவறான இணைப்பு. இது https:// எனத் தொடங்க வேண்டும்'],
    'v.noValidFiles': ['没有可提交的文件', 'No files can be submitted', 'Tiada fail yang boleh dihantar', 'சமர்ப்பிக்கக்கூடிய கோப்புகள் இல்லை'],
    'v.nothing': ['请选择文件或填写分享链接', 'Choose a file or enter a share link', 'Pilih fail atau masukkan pautan kongsi', 'கோப்பைத் தேர்ந்தெடுக்கவும் அல்லது பகிர்வு இணைப்பை உள்ளிடவும்'],
    'e.network': ['网络错误，请重试', 'Network error, please try again', 'Ralat rangkaian, sila cuba lagi', 'பிணையப் பிழை, மீண்டும் முயலவும்'],
    'r.partial': ['部分文件提交失败，可再次点击提交重试。', 'Some files failed. Click Submit again to retry.', 'Sebahagian fail gagal dihantar. Klik Hantar sekali lagi untuk mencuba semula.', 'சில கோப்புகள் சமர்ப்பிக்கப்படவில்லை. மீண்டும் முயல "சமர்ப்பி" என்பதைச் சொடுக்கவும்.'],
    'r.ok': ['提交成功！老师已收到你的作业。', 'Submitted! Your teacher has received your work.', 'Berjaya dihantar! Guru telah menerima kerja anda.', 'வெற்றிகரமாகச் சமர்ப்பிக்கப்பட்டது! உங்கள் ஆசிரியர் அதைப் பெற்றுவிட்டார்.'],
    'r.receipt': ['回执', 'Receipt', 'Resit', 'ரசீது'],
    'r.late': ['（迟交）', ' (late)', ' (lewat)', ' (தாமதம்)'],
    'r.link': ['链接', 'Link', 'Pautan', 'இணைப்பு'],
    'r.time': ['时间', 'Time', 'Masa', 'நேரம்'],

    // ---------- 后端返回的错误 ----------
    'srv.code': ['提交口令不正确', 'Incorrect submission code', 'Kod penghantaran salah', 'சமர்ப்பிப்புக் குறியீடு தவறு'],
    'srv.noAssign': ['作业不存在或未对该班级开放', 'This assignment doesn\'t exist or isn\'t open to your class', 'Tugasan ini tidak wujud atau tidak dibuka untuk kelas anda', 'இந்த வீட்டுப்பாடம் இல்லை அல்லது உங்கள் வகுப்பிற்குத் திறக்கப்படவில்லை'],
    'srv.notOnRoster': ['请从名单中选择你的名字', 'Please select your name from the list', 'Sila pilih nama anda daripada senarai', 'பட்டியலிலிருந்து உங்கள் பெயரைத் தேர்ந்தெடுக்கவும்'],
    'srv.closed': ['该作业已过截止时间', 'This assignment is past its deadline', 'Tarikh akhir tugasan ini telah berlalu', 'இந்த வீட்டுப்பாடத்தின் கடைசி நாள் கடந்துவிட்டது'],
    'srv.badType': ['不支持的文件类型：.{ext}', 'File type not allowed: .{ext}', 'Jenis fail tidak dibenarkan: .{ext}', 'அனுமதிக்கப்படாத கோப்பு வகை: .{ext}'],
    'srv.server': ['服务器错误：{msg}', 'Server error: {msg}', 'Ralat pelayan: {msg}', 'சேவையகப் பிழை: {msg}'],
    'srv.bad': ['请求无效', 'Invalid request', 'Permintaan tidak sah', 'தவறான கோரிக்கை'],
    'srv.pwSet': ['管理密码已设置过', 'An admin password has already been set', 'Kata laluan pentadbir telah ditetapkan', 'நிர்வாகக் கடவுச்சொல் ஏற்கெனவே அமைக்கப்பட்டுள்ளது'],
    'srv.noPw': ['尚未设置管理密码', 'No admin password has been set yet', 'Kata laluan pentadbir belum ditetapkan', 'நிர்வாகக் கடவுச்சொல் இன்னும் அமைக்கப்படவில்லை'],
    'srv.locked': ['密码错误次数过多，请 10 分钟后再试', 'Too many wrong attempts. Try again in 10 minutes', 'Terlalu banyak cubaan salah. Cuba lagi selepas 10 minit', 'பல முறை தவறான முயற்சி. 10 நிமிடங்கள் கழித்து முயலவும்'],
    'srv.badPw': ['管理密码不正确', 'Incorrect admin password', 'Kata laluan pentadbir salah', 'நிர்வாகக் கடவுச்சொல் தவறு'],
    'srv.assignMissing': ['作业不存在', 'Assignment not found', 'Tugasan tidak dijumpai', 'வீட்டுப்பாடம் கிடைக்கவில்லை'],

    // ---------- 管理页 ----------
    'a.title': ['iSubmit · 管理', 'iSubmit · Admin', 'iSubmit · Pentadbir', 'iSubmit · நிர்வாகம்'],
    'a.h1': ['管理', 'Admin', 'Pentadbir', 'நிர்வாகம்'],
    'a.subtitle': ['设置班级、学生名单和作业，查看提交情况', 'Set up classes, student lists and assignments, and track submissions', 'Sediakan kelas, senarai murid dan tugasan, serta pantau penghantaran', 'வகுப்புகள், மாணவர் பட்டியல்கள், வீட்டுப்பாடங்களை அமைத்து, சமர்ப்பிப்புகளைக் கண்காணிக்கவும்'],
    'a.logout': ['退出', 'Log out', 'Log keluar', 'வெளியேறு'],
    'a.connecting': ['正在连接…', 'Connecting…', 'Menyambung…', 'இணைக்கிறது…'],
    'a.login': ['登录', 'Log in', 'Log masuk', 'உள்நுழை'],
    'a.setupTitle': ['首次使用：设置管理密码', 'First time: set an admin password', 'Kali pertama: tetapkan kata laluan pentadbir', 'முதல் பயன்பாடு: நிர்வாகக் கடவுச்சொல்லை அமைக்கவும்'],
    'a.setupHint': ['请立即设置密码（至少 6 位）。设置之后，只有知道密码的人能进入管理页。', 'Set a password now (at least 6 characters). After that, only people who know it can open this page.', 'Tetapkan kata laluan sekarang (sekurang-kurangnya 6 aksara). Selepas itu, hanya mereka yang mengetahuinya boleh membuka halaman ini.', 'இப்போதே கடவுச்சொல்லை அமைக்கவும் (குறைந்தது 6 எழுத்துகள்). அதன் பிறகு, அதை அறிந்தவர்கள் மட்டுமே இப்பக்கத்தைத் திறக்க முடியும்.'],
    'a.pw': ['管理密码', 'Admin password', 'Kata laluan pentadbir', 'நிர்வாகக் கடவுச்சொல்'],
    'a.pw2': ['再输入一次', 'Enter it again', 'Masukkan sekali lagi', 'மீண்டும் உள்ளிடவும்'],
    'a.setupBtn': ['设置并进入', 'Set and continue', 'Tetapkan dan teruskan', 'அமைத்துத் தொடரவும்'],
    'a.tab.subs': ['提交情况', 'Submissions', 'Penghantaran', 'சமர்ப்பிப்புகள்'],
    'a.tab.classes': ['班级与名单', 'Classes & students', 'Kelas & murid', 'வகுப்புகள் & மாணவர்கள்'],
    'a.tab.assign': ['作业', 'Assignments', 'Tugasan', 'வீட்டுப்பாடங்கள்'],
    'a.tab.settings': ['设置', 'Settings', 'Tetapan', 'அமைப்புகள்'],
    'a.refresh': ['刷新', 'Refresh', 'Muat semula', 'புதுப்பி'],
    'a.classesTitle': ['班级与学生名单', 'Classes and student lists', 'Kelas dan senarai murid', 'வகுப்புகளும் மாணவர் பட்டியல்களும்'],
    'a.classesHint': ['每行一个学生名字，可以直接从 Excel 复制一列粘贴进来。学生提交时会从名单中选择自己的名字。', 'One student name per line — you can paste a column straight from Excel. Students pick their own name from this list when submitting.', 'Satu nama murid bagi setiap baris — anda boleh tampal satu lajur terus dari Excel. Murid akan memilih nama sendiri daripada senarai ini semasa menghantar.', 'ஒரு வரிக்கு ஒரு மாணவர் பெயர் — Excel-இலிருந்து ஒரு நெடுவரிசையை நேரடியாக ஒட்டலாம். சமர்ப்பிக்கும்போது மாணவர்கள் இப்பட்டியலிலிருந்து தங்கள் பெயரைத் தேர்ந்தெடுப்பார்கள்.'],
    'a.addClass': ['＋ 添加班级', '+ Add class', '+ Tambah kelas', '+ வகுப்பைச் சேர்'],
    'a.assignHint': ['勾选哪些班级需要交这份作业。截止时间留空表示不限时。取消「开放提交」后学生将看不到这份作业。', 'Tick the classes that must submit this assignment. Leave the deadline empty for no time limit. Untick "Open" to hide it from students.', 'Tandakan kelas yang perlu menghantar tugasan ini. Biarkan tarikh akhir kosong jika tiada had masa. Nyahtanda "Dibuka" untuk menyembunyikannya daripada murid.', 'இந்த வீட்டுப்பாடத்தைச் சமர்ப்பிக்க வேண்டிய வகுப்புகளைத் தேர்வு செய்யவும். நேர வரம்பு இல்லையெனில் கடைசி நாளைக் காலியாக விடவும். மாணவர்களிடமிருந்து மறைக்க "திறந்துள்ளது" என்பதைத் தேர்வு நீக்கவும்.'],
    'a.addAssign': ['＋ 添加作业', '+ Add assignment', '+ Tambah tugasan', '+ வீட்டுப்பாடத்தைச் சேர்'],
    'a.settingsTitle': ['提交设置', 'Submission settings', 'Tetapan penghantaran', 'சமர்ப்பிப்பு அமைப்புகள்'],
    'a.codePh': ['留空表示不需要口令', 'Leave empty for no code', 'Biarkan kosong jika tiada kod', 'குறியீடு தேவையில்லை எனில் காலியாக விடவும்'],
    'a.codeHint': ['建议设置，并在课上告诉学生，防止陌生人乱传文件。', 'Recommended: set one and tell students in class, so strangers can\'t upload files.', 'Disyorkan: tetapkan kod dan beritahu murid di dalam kelas supaya orang luar tidak boleh memuat naik fail.', 'பரிந்துரை: ஒரு குறியீட்டை அமைத்து வகுப்பில் மாணவர்களுக்குச் சொல்லுங்கள்; அந்நியர்கள் கோப்புகளைப் பதிவேற்றுவதைத் தடுக்கலாம்.'],
    'a.maxSize': ['单个文件大小上限（MB）', 'Max file size (MB)', 'Saiz fail maksimum (MB)', 'அதிகபட்ச கோப்பு அளவு (MB)'],
    'a.max35': ['最大 35', 'Up to 35', 'Sehingga 35', 'அதிகபட்சம் 35'],
    'a.afterDl': ['截止后', 'After the deadline', 'Selepas tarikh akhir', 'கடைசி நாளுக்குப் பிறகு'],
    'a.allowLate': ['仍可提交（标记为迟交）', 'Still allow (marked late)', 'Masih dibenarkan (ditanda lewat)', 'இன்னும் அனுமதி (தாமதம் எனக் குறிக்கப்படும்)'],
    'a.exts': ['允许的文件类型', 'Allowed file types', 'Jenis fail yang dibenarkan', 'அனுமதிக்கப்பட்ட கோப்பு வகைகள்'],
    'a.extsPh': ['例如：pdf, docx, jpg（留空表示不限制）', 'e.g. pdf, docx, jpg (leave empty for any type)', 'cth. pdf, docx, jpg (biarkan kosong untuk semua jenis)', 'எ.கா. pdf, docx, jpg (எல்லா வகைகளுக்கும் காலியாக விடவும்)'],
    'a.changePwTitle': ['修改管理密码', 'Change admin password', 'Tukar kata laluan pentadbir', 'நிர்வாகக் கடவுச்சொல்லை மாற்று'],
    'a.newPw': ['新密码', 'New password', 'Kata laluan baharu', 'புதிய கடவுச்சொல்'],
    'a.changePwBtn': ['修改密码', 'Change password', 'Tukar kata laluan', 'கடவுச்சொல்லை மாற்று'],
    'a.save': ['保存设置', 'Save', 'Simpan', 'சேமி'],
    'a.dirty': ['有未保存的修改', 'Unsaved changes', 'Perubahan belum disimpan', 'சேமிக்கப்படாத மாற்றங்கள்'],
    'a.saving': ['保存中…', 'Saving…', 'Menyimpan…', 'சேமிக்கிறது…'],
    'a.saved': ['已保存 · {t}', 'Saved · {t}', 'Disimpan · {t}', 'சேமிக்கப்பட்டது · {t}'],
    'a.saveFailed': ['保存失败：{msg}', 'Save failed: {msg}', 'Gagal menyimpan: {msg}', 'சேமிக்க முடியவில்லை: {msg}'],
    'a.noConfig': ['请先在 config.js 中填写 Apps Script 网址。', 'Please fill in the Apps Script web address in config.js first.', 'Sila isi alamat web Apps Script dalam config.js dahulu.', 'முதலில் config.js-இல் Apps Script இணைய முகவரியை நிரப்பவும்.'],
    'a.noConnect': ['无法连接 Apps Script，请检查 config.js 中的网址和部署设置。', 'Cannot connect to Apps Script. Check the address in config.js and the deployment settings.', 'Tidak dapat menyambung ke Apps Script. Semak alamat dalam config.js dan tetapan penggunaan.', 'Apps Script-உடன் இணைக்க முடியவில்லை. config.js-இல் உள்ள முகவரியையும் வெளியீட்டு அமைப்புகளையும் சரிபார்க்கவும்.'],
    'a.pwMismatch': ['两次输入不一致', 'The two entries don\'t match', 'Kedua-dua entri tidak sepadan', 'இரண்டு உள்ளீடுகளும் பொருந்தவில்லை'],
    'a.pwChanged': ['密码已修改', 'Password changed', 'Kata laluan telah ditukar', 'கடவுச்சொல் மாற்றப்பட்டது'],
    'a.noClasses': ['还没有班级，点下方「添加班级」开始。', 'No classes yet. Click "Add class" below to start.', 'Belum ada kelas. Klik "Tambah kelas" di bawah untuk bermula.', 'இன்னும் வகுப்புகள் இல்லை. தொடங்க கீழே உள்ள "வகுப்பைச் சேர்" என்பதைச் சொடுக்கவும்.'],
    'a.nStudents': ['{n} 人', '{n} students', '{n} murid', '{n} மாணவர்கள்'],
    'a.classPh': ['班级名称，例如：三年二班', 'Class name, e.g. 3B', 'Nama kelas, cth. 3 Bestari', 'வகுப்புப் பெயர், எ.கா. 3B'],
    'a.delete': ['删除', 'Delete', 'Padam', 'நீக்கு'],
    'a.confirmDelClass': ['删除班级「{name}」？已提交的文件不会被删除。', 'Delete class "{name}"? Files already submitted will not be deleted.', 'Padam kelas "{name}"? Fail yang telah dihantar tidak akan dipadam.', '"{name}" வகுப்பை நீக்கவா? ஏற்கெனவே சமர்ப்பிக்கப்பட்ட கோப்புகள் நீக்கப்படாது.'],
    'a.unnamed': ['未命名', 'Untitled', 'Tanpa nama', 'பெயரிடப்படாதது'],
    'a.studentList': ['学生名单（每行一个）', 'Students (one per line)', 'Murid (satu bagi setiap baris)', 'மாணவர்கள் (ஒரு வரிக்கு ஒருவர்)'],
    'a.studentPh': ['张三\n李四\n王五', 'Aisyah\nWei Jie\nPriya', 'Aisyah\nWei Jie\nPriya', 'Priya\nKumar\nAisyah'],
    'a.noAssign': ['还没有作业，点下方「添加作业」开始。', 'No assignments yet. Click "Add assignment" below to start.', 'Belum ada tugasan. Klik "Tambah tugasan" di bawah untuk bermula.', 'இன்னும் வீட்டுப்பாடங்கள் இல்லை. தொடங்க கீழே உள்ள "வீட்டுப்பாடத்தைச் சேர்" என்பதைச் சொடுக்கவும்.'],
    'a.addClassFirst': ['请先在「班级与名单」中添加班级', 'Add a class under "Classes & students" first', 'Tambah kelas di bawah "Kelas & murid" dahulu', 'முதலில் "வகுப்புகள் & மாணவர்கள்" பகுதியில் வகுப்பைச் சேர்க்கவும்'],
    'a.unnamedClass': ['（未命名班级）', '(untitled class)', '(kelas tanpa nama)', '(பெயரிடப்படாத வகுப்பு)'],
    'a.assignPh': ['作业标题，例如：第1次作业', 'Assignment title, e.g. Homework 1', 'Tajuk tugasan, cth. Kerja Rumah 1', 'வீட்டுப்பாடத் தலைப்பு, எ.கா. வீட்டுப்பாடம் 1'],
    'a.confirmDelAssign': ['删除作业「{name}」？已提交的文件不会被删除。', 'Delete assignment "{name}"? Files already submitted will not be deleted.', 'Padam tugasan "{name}"? Fail yang telah dihantar tidak akan dipadam.', '"{name}" வீட்டுப்பாடத்தை நீக்கவா? ஏற்கெனவே சமர்ப்பிக்கப்பட்ட கோப்புகள் நீக்கப்படாது.'],
    'a.deadline': ['截止时间', 'Deadline', 'Tarikh akhir', 'கடைசி நாள்'],
    'a.status': ['状态', 'Status', 'Status', 'நிலை'],
    'a.open': ['开放提交', 'Open', 'Dibuka', 'திறந்துள்ளது'],
    'a.classesToSubmit': ['需要提交的班级', 'Classes that must submit', 'Kelas yang perlu menghantar', 'சமர்ப்பிக்க வேண்டிய வகுப்புகள்'],
    'a.v.className': ['有班级没有填写名称', 'A class has no name', 'Ada kelas tanpa nama', 'ஒரு வகுப்புக்குப் பெயர் இல்லை'],
    'a.v.dupStudent': ['「{c}」中有重名学生：{n}（请加以区分，例如 {n}A / {n}B）', 'Class "{c}" has a duplicate name: {n} (make them different, e.g. {n} A / {n} B)', 'Kelas "{c}" mempunyai nama berulang: {n} (bezakan, cth. {n} A / {n} B)', '"{c}" வகுப்பில் ஒரே பெயர் இருமுறை உள்ளது: {n} (வேறுபடுத்தவும், எ.கா. {n} A / {n} B)'],
    'a.v.dupClass': ['班级名称重复：{c}', 'Duplicate class name: {c}', 'Nama kelas berulang: {c}', 'வகுப்புப் பெயர் இருமுறை உள்ளது: {c}'],
    'a.v.assignName': ['有作业没有填写标题', 'An assignment has no title', 'Ada tugasan tanpa tajuk', 'ஒரு வீட்டுப்பாடத்துக்குத் தலைப்பு இல்லை'],
    'a.v.assignNoClass': ['作业「{a}」没有勾选任何班级', 'Assignment "{a}" has no class ticked', 'Tugasan "{a}" tidak ditandakan untuk mana-mana kelas', '"{a}" வீட்டுப்பாடத்துக்கு எந்த வகுப்பும் தேர்வு செய்யப்படவில்லை'],
    'a.noAssignOpt': ['暂无作业', 'No assignments', 'Tiada tugasan', 'வீட்டுப்பாடங்கள் இல்லை'],
    'a.addAssignFirst': ['先到「作业」中添加作业并保存。', 'Add an assignment under "Assignments" and save first.', 'Tambah tugasan di bawah "Tugasan" dan simpan dahulu.', 'முதலில் "வீட்டுப்பாடங்கள்" பகுதியில் வீட்டுப்பாடத்தைச் சேர்த்துச் சேமிக்கவும்.'],
    'a.closedSuffix': ['（已关闭）', ' (closed)', ' (ditutup)', ' (மூடப்பட்டது)'],
    'a.openRoot': ['打开 Drive 作业文件夹 ↗', 'Open Drive folder ↗', 'Buka folder Drive ↗', 'Drive கோப்புறையைத் திற ↗'],
    'a.openSheet': ['打开提交登记表 ↗', 'Open submission log ↗', 'Buka log penghantaran ↗', 'சமர்ப்பிப்புப் பதிவேட்டைத் திற ↗'],
    'a.notSaved': ['这份作业还没有保存，请先点「保存设置」。', 'This assignment hasn\'t been saved yet. Click "Save" first.', 'Tugasan ini belum disimpan. Klik "Simpan" dahulu.', 'இந்த வீட்டுப்பாடம் இன்னும் சேமிக்கப்படவில்லை. முதலில் "சேமி" என்பதைச் சொடுக்கவும்.'],
    'a.submittedOf': [' / {total} 人已提交', ' / {total} submitted', ' / {total} telah menghantar', ' / {total} பேர் சமர்ப்பித்துள்ளனர்'],
    'a.dueShort': ['截止 {d}', 'Due {d}', 'Tarikh akhir {d}', 'கடைசி நாள் {d}'],
    'a.noClassTicked': ['这份作业没有勾选班级。', 'No classes are ticked for this assignment.', 'Tiada kelas ditandakan untuk tugasan ini.', 'இந்த வீட்டுப்பாடத்துக்கு வகுப்புகள் தேர்வு செய்யப்படவில்லை.'],
    'a.submitted': ['已交', 'Submitted', 'Dihantar', 'சமர்ப்பித்தார்'],
    'a.nCopies': ['{n} 份', '×{n}', '×{n}', '×{n}'],
    'a.missing': ['未交', 'Missing', 'Belum hantar', 'சமர்ப்பிக்கவில்லை'],
    'a.late': ['迟交', 'Late', 'Lewat', 'தாமதம்'],
    'a.link': ['链接', 'Link', 'Pautan', 'இணைப்பு'],
    'a.openFolder': ['打开文件夹 ↗', 'Open folder ↗', 'Buka folder ↗', 'கோப்புறையைத் திற ↗'],
    'a.copyMissing': ['复制未交名单', 'Copy missing list', 'Salin senarai belum hantar', 'சமர்ப்பிக்காதோர் பட்டியலை நகலெடு'],
    'a.copied': ['已复制', 'Copied', 'Disalin', 'நகலெடுக்கப்பட்டது'],
    'a.missingText': ['{c} 未交（{n}人）：{names}', '{c} — not submitted ({n}): {names}', '{c} — belum hantar ({n}): {names}', '{c} — சமர்ப்பிக்காதோர் ({n}): {names}'],
    'a.copyPrompt': ['复制未交名单：', 'Copy the list:', 'Salin senarai:', 'பட்டியலை நகலெடுக்கவும்:'],
    'a.lastSubmit': ['最后提交', 'Last submitted', 'Kali terakhir dihantar', 'கடைசியாகச் சமர்ப்பித்தது'],
    'a.emptyRoster': ['该班级名单为空', 'This class has no students', 'Kelas ini tiada murid', 'இந்த வகுப்பில் மாணவர்கள் இல்லை'],
  };

  // 后端返回的是华文错误信息，这里转成当前语言
  const SERVER = [
    [/^(提交)?口令不正确$/, 'srv.code'],
    [/^请选择班级$/, 'sel.class'],
    [/^作业不存在或未对该班级开放$/, 'srv.noAssign'],
    [/^请从名单中选择你的名字$/, 'srv.notOnRoster'],
    [/^该作业已过截止时间$/, 'srv.closed'],
    [/^请输入有效的链接/, 'v.badLink'],
    [/^不支持的文件类型：\.(.*)$/, 'srv.badType', m => ({ ext: m[1] })],
    [/^文件为空$/, 'f.empty'],
    [/^文件超过 (\d+)MB$/, 'f.tooBig', m => ({ n: m[1] })],
    [/^服务器错误：(.*)$/, 'srv.server', m => ({ msg: m[1] })],
    [/^(请求格式错误|未知操作)$/, 'srv.bad'],
    [/^管理密码已设置过$/, 'srv.pwSet'],
    [/^密码至少 6 位$/, 'pw.min'],
    [/^尚未设置管理密码$/, 'srv.noPw'],
    [/^密码错误次数过多/, 'srv.locked'],
    [/^管理密码不正确$/, 'srv.badPw'],
    [/^作业不存在$/, 'srv.assignMissing'],
  ];

  let lang = (function () {
    try { const s = localStorage.getItem('isubmit-lang'); if (s in IDX) return s; } catch (_) {}
    const n = (navigator.language || '').toLowerCase();
    if (n.startsWith('en')) return 'en';
    if (n.startsWith('ms') || n.startsWith('id')) return 'ms';
    if (n.startsWith('ta')) return 'ta';
    return 'zh';
  })();

  function t(key, vars) {
    const row = D[key];
    let s = row ? (row[IDX[lang]] != null ? row[IDX[lang]] : row[0]) : key;
    if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
    return s;
  }

  function server(msg) {
    msg = String(msg || '');
    for (const [re, key, fn] of SERVER) {
      const m = msg.match(re);
      if (m) return t(key, fn ? fn(m) : null);
    }
    return msg;
  }

  function apply(root) {
    root = root || document;
    document.documentElement.lang = HTML_LANG[lang];
    root.querySelectorAll('[data-i18n]').forEach(e => { e.textContent = t(e.dataset.i18n); });
    root.querySelectorAll('[data-i18n-ph]').forEach(e => { e.placeholder = t(e.dataset.i18nPh); });
    root.querySelectorAll('[data-i18n-title]').forEach(e => { e.title = t(e.dataset.i18nTitle); });
  }

  function fmtDate(iso, opts) { return iso ? new Date(iso).toLocaleString(LOCALE[lang], opts) : ''; }
  function fmtTime(d) { return (d || new Date()).toLocaleTimeString(LOCALE[lang]); }
  function list(arr) { return arr.join(lang === 'zh' ? '、' : ', '); }

  /** 在 el 中放一排语言按钮；切换时调用 onChange */
  function mountSwitcher(el, onChange) {
    el.setAttribute('role', 'group');
    const paint = () => {
      el.setAttribute('aria-label', t('lang.label'));
      el.querySelectorAll('button').forEach(b => {
        const on = b.dataset.lang === lang;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', on);
      });
    };
    LANGS.forEach(([code, label]) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.lang = code;
      b.lang = HTML_LANG[code];
      b.textContent = label;
      b.onclick = () => {
        if (code === lang) return;
        lang = code;
        try { localStorage.setItem('isubmit-lang', code); } catch (_) {}
        apply(); paint();
        if (onChange) onChange();
      };
      el.appendChild(b);
    });
    paint();
  }

  window.I18N = { t, server, apply, fmtDate, fmtTime, list, mountSwitcher, get lang() { return lang; } };
})();
