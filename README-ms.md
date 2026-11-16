[华文](README.md) · [English](README-en.md) · **Bahasa Melayu** · [தமிழ்](README-ta.md)

# iSubmit · Penghantaran Kerja Rumah

Murid memuat naik kerja melalui halaman web terus ke Google Drive guru, dan tidak dapat melihat kerja murid lain. Biasanya murid tidak memerlukan akaun Google; hanya apabila fail terlalu besar dan mereka menghantar pautan kongsi sebagai ganti, barulah mereka perlu menyimpannya dalam Google Drive sendiri terlebih dahulu.

## Ciri-ciri utama

- **Halaman penghantaran murid**: pilih kelas, pilih nama sendiri daripada senarai, pilih tugasan, kemudian seret dan lepas satu atau lebih fail. Jika fail terlalu besar, hantar pautan kongsi dari Google Drive sendiri sebagai ganti. Resit dipaparkan selepas penghantaran.
- **Halaman pentadbir**: sediakan kelas dan senarai murid, tajuk dan tarikh akhir tugasan, kod penghantaran, jenis fail yang dibenarkan dan had saiz, serta tukar kata laluan pentadbir.
- **Gambaran penghantaran**: bagi setiap tugasan, lihat siapa dalam setiap kelas yang telah menghantar, belum menghantar atau lewat; salin senarai murid yang belum hantar dengan satu klik; buka pautan yang dihantar oleh murid.
- **Pelbagai bahasa**: kedua-dua halaman boleh ditukar antara 华文 / English / Bahasa Melayu / தமிழ்.
- **Penyusunan automatik**: fail disimpan dalam Drive mengikut kelas / tugasan dan dinamakan "Nama_nama-fail-asal". Penghantaran semula mengekalkan fail terdahulu, fail lewat diberi awalan "[LATE]", dan setiap penghantaran direkodkan dalam Google Sheet.

## Cara ia berfungsi

Halaman web hanyalah halaman statik yang boleh diletakkan di GitHub Pages atau mana-mana pelayan web. Fail yang dimuat naik diserahkan kepada Google Apps Script yang berjalan atas nama guru, lalu disimpan ke dalam Drive guru. Murid hanya boleh "memuat naik" melalui skrip ini dan tiada cara untuk melihat sebarang fail, jadi mereka tidak dapat melihat kerja murid lain.

## Sediakan sendiri

Panduan pemasangan: [华文](guide-zh.md) · [English](guide-en.md) · [Bahasa Melayu](guide-ms.md) · [தமிழ்](guide-ta.md)
