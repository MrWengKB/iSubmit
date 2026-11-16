# iSubmit Setup Guide

[华文](guide-zh.md) · **English** · [Bahasa Melayu](guide-ms.md) · [தமிழ்](guide-ta.md)

Follow these steps to run your own copy of iSubmit. Students' work will be saved to **your own** Google Drive. It takes about 15 minutes and needs no coding.

You need: a Google account, and somewhere to host the web pages (your own server, or free GitHub Pages).

---

## Step 1: Download the code

1. Open this repository's home page, click the green **Code** button → **Download ZIP**.
2. Unzip it. The folder contains:

```
index.html        Student submission page
admin.html        Admin page
config.js         Where you put your Web App URL
style.css         Styles
i18n.js           Translations
apps-script/
  Code.gs         Back-end code
```

---

## Step 2: Create the Apps Script back end

1. Go to <https://script.google.com>, sign in with your Google account, and click **New project** (top left).
2. Click "Untitled project" (top left) and rename it `iSubmit`.
3. Delete everything in the editor. Open `apps-script/Code.gs` in a text editor, **copy all of it and paste it in**, then press `Ctrl+S` (`⌘+S` on Mac) to save. **You don't need to change anything.**
4. Click the gear icon **Project Settings** on the left and set **Time zone** to your region (e.g. `(GMT+08:00) Singapore`).
5. Go back to the editor (the `< >` icon on the left), choose **`setup`** in the function drop-down at the top, and click **Run**.
   - The first time, you'll be asked to authorise it: click **Review permissions** → choose your account.
   - If you see "Google hasn't verified this app", click **Advanced** → **Go to iSubmit (unsafe)** → **Allow**. This is your own script, so it's safe.
   - When it finishes, a folder called "iSubmit 作业提交" (iSubmit submissions) will appear in your Drive.

---

## Step 3: Get the Web App URL

1. Click **Deploy** (top right) → **New deployment**.
2. Click the gear next to "Select type" → **Web app**.
3. Use these settings:
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
4. Click **Deploy**, then copy the URL under **Web app**. It looks like this:

```
https://script.google.com/macros/s/AKfycb……a long string……/exec
```

---

## Step 4: Put the URL in config.js

Open `config.js` in a text editor, replace the URL inside the quotes with the one you just copied, and save:

```js
window.ISUBMIT_URL = 'https://script.google.com/macros/s/YOUR-DEPLOYMENT-ID/exec';
```

> Only change what's inside the quotes. Keep the quotes and the semicolon at the end.

---

## Step 5: Publish the web pages

The pages are plain static files (HTML / CSS / JS). They need no database and no PHP, Node or other server-side program, so they can go anywhere that serves web pages. Pick one option:

### Option A: Your own server

Upload these 5 files — `index.html`, `admin.html`, `config.js`, `style.css`, `i18n.js` — to your server's web folder (e.g. `/var/www/html/isubmit/`, or `public_html/isubmit/` on shared hosting). You don't need to upload the `apps-script` folder.

- Student submission page: `https://your-domain/isubmit/`
- Admin page: `https://your-domain/isubmit/admin.html`

> Use **https** if you can, because the admin page asks for a password. A school intranet server, a NAS web service, or static hosting such as Netlify or Cloudflare Pages all work.

### Option B: GitHub Pages (free, if you don't have a server)

1. Sign in to GitHub, click **+** (top right) → **New repository**.
   - Repository name: `iSubmit`
   - Choose **Public** (free GitHub Pages needs a public repository; the code contains no passwords or student data)
   - Click **Create repository**
2. On the new repository page, click **uploading an existing file**, drag in **all the files and the `apps-script` folder** from the unzipped folder, then click **Commit changes**.
3. Go to the repository's **Settings** → **Pages**:
   - Source: **Deploy from a branch**
   - Branch: **main**, folder **/ (root)**, then **Save**
4. After a minute or two, your pages are live:
   - Student submission page: `https://your-github-username.github.io/iSubmit/`
   - Admin page: `https://your-github-username.github.io/iSubmit/admin.html`

---

## Step 6: Set the admin password and start using it

1. Open the admin page **right away**. The first time, it asks you to set an admin password (at least 6 characters).
2. Under **Classes & students**, add your classes and paste in student names, one per line (you can copy a column straight from Excel).
3. Under **Assignments**, add a title and deadline, and tick the classes that must submit.
4. Under **Settings**, we recommend setting a **Submission code** so strangers can't upload files.
5. Click **Save** at the bottom.
6. Send students the submission page URL and the submission code. That's it.

The language buttons at the top right of both pages switch between 华文, English, Bahasa Melayu and தமிழ்.

---

## FAQ

**How do I update after changing Code.gs?**
In Apps Script, click **Deploy → Manage deployments** → the pencil icon → Version: **New version** → **Deploy**. The URL stays the same, so you don't need to edit `config.js`. ⚠️ Don't click "New deployment", or you'll get a new URL.

**Forgot the admin password?**
Apps Script → **Project Settings** → **Script Properties** at the bottom. Delete `ADMIN_HASH`, then open the admin page and set a new one. Your classes, student lists and assignments are not affected.

**Where is the work saved?**
In your Google Drive, in the "iSubmit 作业提交" folder, sorted by class / assignment. The "iSubmit Submission Log" spreadsheet in the same folder records every submission.

**Is there a file size limit?**
Up to 35 MB per file (20 MB by default; you can change it on the admin page). For bigger files such as videos, students can save them to their own Google Drive and paste a share link on the submission page.
