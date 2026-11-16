# iSubmit 部署指南

**华文** · [English](guide-en.md) · [Bahasa Melayu](guide-ms.md) · [தமிழ்](guide-ta.md)

按照下面的步骤，你可以拥有一套自己的 iSubmit，作业会存进**你自己的** Google Drive。全程约 15 分钟，不需要写代码。

你需要：一个 Google 账号，以及一个放网页的地方（自己的服务器，或者免费的 GitHub Pages）。

---

## 第一步：下载代码

1. 打开本仓库首页，点绿色的 **Code** 按钮 → **Download ZIP**。
2. 解压，得到一个文件夹，里面有：

```
index.html        学生提交页
admin.html        管理页
config.js         填写 Web App 网址的地方
style.css         样式
i18n.js           多语言文字
apps-script/
  Code.gs         后端代码
```

---

## 第二步：建立 Apps Script 后端

1. 打开 <https://script.google.com>，登录你的 Google 账号，点左上角 **新项目**。
2. 点左上角「无标题项目」，改名为 `iSubmit`。
3. 把编辑器里的默认内容全部删掉，用文本编辑器打开 `apps-script/Code.gs`，**全部复制粘贴**进去，按 `Ctrl+S`（Mac 按 `⌘+S`）保存。**不需要修改任何内容。**
4. 点左侧齿轮 **项目设置**，把 **时区** 改成你所在的地区（例如 `(GMT+08:00) Singapore`）。
5. 回到编辑器（左侧 `< >` 图标），在上方函数下拉框选择 **`setup`**，点 **运行**。
   - 第一次会要求授权：点 **审核权限** → 选择你的账号。
   - 出现「Google 尚未验证此应用」时，点 **高级** → **转至 iSubmit（不安全）** → **允许**。这是你自己的脚本，可以放心。
   - 运行完成后，你的 Drive 里会出现一个「iSubmit 作业提交」文件夹。

---

## 第三步：获取 Web App 网址

1. 点右上角 **部署** → **新建部署**。
2. 点「选择类型」旁的齿轮 → **网页应用**。
3. 按下面设置：
   - **执行身份**：我（你的邮箱）
   - **谁可以访问**：任何人
4. 点 **部署**，然后复制 **网页应用** 下面的网址，它长这样：

```
https://script.google.com/macros/s/AKfycb……一长串……/exec
```

---

## 第四步：把网址写进 config.js

用文本编辑器打开 `config.js`，把引号里的网址换成你刚才复制的网址，保存：

```js
window.ISUBMIT_URL = 'https://script.google.com/macros/s/你的部署ID/exec';
```

> 只改引号里面的内容，引号和末尾的分号要保留。

---

## 第五步：发布网页

网页是纯静态文件（HTML / CSS / JS），不需要数据库，也不需要 PHP、Node 等后端程序，放在任何能提供网页的地方都可以。选一种即可：

### 方式 A：放在自己的服务器

把 `index.html`、`admin.html`、`config.js`、`style.css`、`i18n.js` 这 5 个文件上传到服务器的网站目录（例如 `/var/www/html/isubmit/`，或者虚拟主机的 `public_html/isubmit/`）。`apps-script` 文件夹不用上传。

- 学生提交页：`https://你的域名/isubmit/`
- 管理页：`https://你的域名/isubmit/admin.html`

> 建议使用 **https**，因为管理页需要输入密码。学校内网服务器、NAS 自带的网页服务，或者 Netlify、Cloudflare Pages 这类静态网站托管，都可以用。

### 方式 B：GitHub Pages（免费，没有服务器时用）

1. 登录 GitHub，点右上角 **+** → **New repository**。
   - Repository name 填 `iSubmit`
   - 选 **Public**（免费的 GitHub Pages 需要公开仓库，代码里没有任何密码或学生资料）
   - 点 **Create repository**
2. 在新仓库页面点 **uploading an existing file**，把解压后文件夹里的**所有文件和 `apps-script` 文件夹**拖进去，点 **Commit changes**。
3. 进入仓库 **Settings** → **Pages**：
   - Source 选 **Deploy from a branch**
   - Branch 选 **main**，目录选 **/ (root)**，点 **Save**
4. 等一两分钟，网址就可以用了：
   - 学生提交页：`https://你的GitHub用户名.github.io/iSubmit/`
   - 管理页：`https://你的GitHub用户名.github.io/iSubmit/admin.html`

---

## 第六步：设置管理密码并开始使用

1. **立即**打开管理页，第一次进入时会要求设置管理密码（至少 6 位）。
2. 在 **班级与名单** 添加班级，每行粘贴一个学生名字（可以直接从 Excel 复制一列）。
3. 在 **作业** 添加作业标题、截止时间，勾选需要提交的班级。
4. 在 **设置** 里建议填写 **提交口令**，防止陌生人乱传文件。
5. 点底部 **保存设置**。
6. 把学生提交页的网址和提交口令发给学生，就完成了。

两个页面右上角的语言按钮可以切换 华文、English、Bahasa Melayu、தமிழ்。

---

## 常见问题

**改了 Code.gs 以后怎么更新？**
在 Apps Script 点 **部署 → 管理部署** → 点铅笔图标 → 版本选 **新版本** → **部署**。这样网址不变，不需要改 `config.js`。⚠️ 不要点「新建部署」，否则会得到一个新网址。

**忘记管理密码？**
Apps Script → **项目设置** → 最下方 **脚本属性**，删除 `ADMIN_HASH`，再打开管理页重新设置。班级、名单、作业不受影响。

**作业存在哪里？**
你的 Google Drive →「iSubmit 作业提交」文件夹，按「班级 / 作业」分类。同一文件夹里的「iSubmit Submission Log」表格记录了每一次提交。

**文件大小有限制吗？**
单个文件最大 35 MB（默认 20 MB，可在管理页调整）。更大的文件（例如视频），学生可以存到自己的 Google Drive，在提交页填写分享链接。
