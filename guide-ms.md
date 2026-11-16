# Panduan Pemasangan iSubmit

[华文](guide-zh.md) · [English](guide-en.md) · **Bahasa Melayu** · [தமிழ்](guide-ta.md)

Ikuti langkah di bawah untuk menyediakan iSubmit anda sendiri. Kerja murid akan disimpan dalam Google Drive **anda sendiri**. Ia mengambil masa kira-kira 15 minit dan tidak memerlukan pengaturcaraan.

Anda perlukan: sebuah akaun Google, dan tempat untuk meletakkan halaman web (pelayan sendiri, atau GitHub Pages yang percuma).

> Nama butang dalam panduan ini mengikut paparan Google dan GitHub dalam Bahasa Inggeris.

---

## Langkah 1: Muat turun kod

1. Buka halaman utama repositori ini, klik butang hijau **Code** → **Download ZIP**.
2. Nyahzip fail tersebut. Folder itu mengandungi:

```
index.html        Halaman penghantaran murid
admin.html        Halaman pentadbir
config.js         Tempat untuk mengisi URL Web App
style.css         Gaya paparan
i18n.js           Terjemahan
apps-script/
  Code.gs         Kod bahagian belakang (back end)
```

---

## Langkah 2: Sediakan bahagian belakang Apps Script

1. Buka <https://script.google.com>, log masuk dengan akaun Google anda, dan klik **New project** (kiri atas).
2. Klik "Untitled project" (kiri atas) dan tukar namanya kepada `iSubmit`.
3. Padam semua kandungan dalam editor. Buka `apps-script/Code.gs` dengan editor teks, **salin semuanya dan tampal** ke dalam editor, kemudian tekan `Ctrl+S` (`⌘+S` pada Mac) untuk menyimpan. **Tiada apa-apa yang perlu diubah.**
4. Klik ikon gear **Project Settings** di sebelah kiri dan tetapkan **Time zone** mengikut kawasan anda (cth. `(GMT+08:00) Singapore`).
5. Kembali ke editor (ikon `< >` di sebelah kiri), pilih **`setup`** dalam senarai fungsi di bahagian atas, dan klik **Run**.
   - Kali pertama, anda akan diminta memberi kebenaran: klik **Review permissions** → pilih akaun anda.
   - Jika muncul "Google hasn't verified this app", klik **Advanced** → **Go to iSubmit (unsafe)** → **Allow**. Ini skrip anda sendiri, jadi ia selamat.
   - Selepas selesai, folder bernama "iSubmit 作业提交" (penghantaran iSubmit) akan muncul dalam Drive anda.

---

## Langkah 3: Dapatkan URL Web App

1. Klik **Deploy** (kanan atas) → **New deployment**.
2. Klik ikon gear di sebelah "Select type" → **Web app**.
3. Gunakan tetapan berikut:
   - **Execute as**: Me (e-mel anda)
   - **Who has access**: Anyone
4. Klik **Deploy**, kemudian salin URL di bawah **Web app**. Rupanya seperti ini:

```
https://script.google.com/macros/s/AKfycb……rentetan panjang……/exec
```

---

## Langkah 4: Masukkan URL ke dalam config.js

Buka `config.js` dengan editor teks, gantikan URL di dalam tanda petikan dengan URL yang anda salin tadi, dan simpan:

```js
window.ISUBMIT_URL = 'https://script.google.com/macros/s/ID-PENGGUNAAN-ANDA/exec';
```

> Ubah kandungan di dalam tanda petikan sahaja. Kekalkan tanda petikan dan koma bertitik di hujung.

---

## Langkah 5: Terbitkan halaman web

Halaman ini hanyalah fail statik (HTML / CSS / JS). Ia tidak memerlukan pangkalan data, PHP, Node atau program pelayan lain, jadi ia boleh diletakkan di mana-mana tempat yang boleh memaparkan laman web. Pilih satu cara:

### Cara A: Pelayan sendiri

Muat naik 5 fail ini — `index.html`, `admin.html`, `config.js`, `style.css`, `i18n.js` — ke folder laman web pada pelayan anda (cth. `/var/www/html/isubmit/`, atau `public_html/isubmit/` pada hos kongsi). Folder `apps-script` tidak perlu dimuat naik.

- Halaman penghantaran murid: `https://domain-anda/isubmit/`
- Halaman pentadbir: `https://domain-anda/isubmit/admin.html`

> Gunakan **https** jika boleh, kerana halaman pentadbir memerlukan kata laluan. Pelayan intranet sekolah, perkhidmatan web pada NAS, atau hos statik seperti Netlify dan Cloudflare Pages semuanya boleh digunakan.

### Cara B: GitHub Pages (percuma, jika tiada pelayan)

1. Log masuk ke GitHub, klik **+** (kanan atas) → **New repository**.
   - Repository name: `iSubmit`
   - Pilih **Public** (GitHub Pages percuma memerlukan repositori awam; kod ini tidak mengandungi kata laluan atau data murid)
   - Klik **Create repository**
2. Pada halaman repositori baharu, klik **uploading an existing file**, seret **semua fail dan folder `apps-script`** dari folder yang telah dinyahzip, kemudian klik **Commit changes**.
3. Pergi ke **Settings** → **Pages** dalam repositori:
   - Source: **Deploy from a branch**
   - Branch: **main**, folder **/ (root)**, kemudian **Save**
4. Selepas seminit dua, halaman anda sudah boleh digunakan:
   - Halaman penghantaran murid: `https://nama-pengguna-github.github.io/iSubmit/`
   - Halaman pentadbir: `https://nama-pengguna-github.github.io/iSubmit/admin.html`

---

## Langkah 6: Tetapkan kata laluan pentadbir dan mula menggunakannya

1. Buka halaman pentadbir **dengan segera**. Kali pertama, anda akan diminta menetapkan kata laluan pentadbir (sekurang-kurangnya 6 aksara).
2. Di bawah **Kelas & murid**, tambah kelas dan tampal nama murid, satu nama bagi setiap baris (boleh salin satu lajur terus dari Excel).
3. Di bawah **Tugasan**, tambah tajuk dan tarikh akhir, dan tandakan kelas yang perlu menghantar.
4. Di bawah **Tetapan**, kami syorkan anda menetapkan **Kod penghantaran** supaya orang luar tidak boleh memuat naik fail.
5. Klik **Simpan** di bahagian bawah.
6. Hantar URL halaman penghantaran dan kod penghantaran kepada murid. Selesai.

Butang bahasa di kanan atas kedua-dua halaman boleh menukar antara 华文, English, Bahasa Melayu dan தமிழ்.

---

## Soalan Lazim

**Bagaimana mengemas kini selepas menukar Code.gs?**
Dalam Apps Script, klik **Deploy → Manage deployments** → ikon pensel → Version: **New version** → **Deploy**. URL tidak berubah, jadi `config.js` tidak perlu diubah. ⚠️ Jangan klik "New deployment", jika tidak anda akan mendapat URL baharu.

**Terlupa kata laluan pentadbir?**
Apps Script → **Project Settings** → **Script Properties** di bahagian bawah. Padam `ADMIN_HASH`, kemudian buka halaman pentadbir dan tetapkan kata laluan baharu. Kelas, senarai murid dan tugasan tidak terjejas.

**Di manakah kerja murid disimpan?**
Dalam Google Drive anda, di folder "iSubmit 作业提交", disusun mengikut kelas / tugasan. Hamparan "iSubmit Submission Log" dalam folder yang sama merekodkan setiap penghantaran.

**Adakah had saiz fail?**
Maksimum 35 MB setiap fail (20 MB secara lalai; boleh diubah di halaman pentadbir). Untuk fail yang lebih besar seperti video, murid boleh menyimpannya dalam Google Drive sendiri dan menampal pautan kongsi di halaman penghantaran.
