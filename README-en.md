[华文](README.md) · **English** · [Bahasa Melayu](README-ms.md) · [தமிழ்](README-ta.md)

# iSubmit · Homework Submission

Students upload their work through a web page straight into the teacher's Google Drive, and cannot see each other's work. Students normally don't need a Google account; only when a file is too big and they submit a share link instead do they need to save it to their own Google Drive first.

## Main features

- **Student submission page**: choose the class, pick your own name from the list, choose the assignment, then drag and drop one or more files. If a file is too big, submit a share link from your own Google Drive instead. A receipt is shown after submitting.
- **Admin page**: set up classes and student lists, assignment titles and deadlines, a submission code, allowed file types and size limit, and change the admin password.
- **Submission overview**: for each assignment, see who in each class has submitted, who hasn't and who was late; copy the list of missing students in one click; open the links students submitted.
- **Multilingual**: both pages switch between 华文 / English / Bahasa Melayu / தமிழ்.
- **Automatic filing**: files are saved in Drive by class / assignment and named "Name_original-file-name". Resubmissions keep the earlier files, late files are prefixed with "[LATE]", and every submission is logged in a Google Sheet.

## How it works

The web pages are just static pages that can be hosted on GitHub Pages or any web server. Uploaded files are passed to a Google Apps Script that runs as the teacher and writes them into the teacher's Drive. Students can only "upload" through this script and have no way to view any files, so they cannot see other students' work.

## Set up your own

Setup guide: [华文](guide-zh.md) · [English](guide-en.md) · [Bahasa Melayu](guide-ms.md) · [தமிழ்](guide-ta.md)
