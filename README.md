# SIM-BMN Barang Milik Negara — Prototype Fungsional

Prototype frontend berdasarkan konsep PDF `Konsep Website BMN.pdf`.

## Jalankan

Paling sederhana: buka `index.html` di browser modern.

Untuk mode server lokal:

```bash
python -m http.server 8000
```

Lalu buka `http://localhost:8000`.

## Fitur

- Dashboard responsif dengan ringkasan kendaraan, ruangan, barang, status BMN, dan transaksi terbaru.
- Menu utama Kendaraan, Ruangan, dan Barang memiliki tampilan inventaris tersendiri, dilengkapi statistik, tabel, pencarian, filter, dan paginasi.
- Data inventaris mendukung tambah, detail, edit, hapus, serta ekspor CSV untuk barang; data disimpan di localStorage browser.
- Menu Peminjaman menampilkan daftar transaksi dengan pencarian, filter jenis/status/periode, paginasi, detail, dan ekspor CSV.
- Menu Perpanjangan menampilkan daftar pengajuan beserta ringkasan status, pencarian, filter jenis/status/periode, paginasi, detail, dan ekspor CSV.
- Menu Pengembalian menampilkan nomor dan tanggal pengembalian, peminjam, jenis BMN, jumlah, status, pencarian, filter, paginasi, detail, dan ekspor CSV.
- Pengajuan dari daftar memilih Kendaraan, Ruangan, atau Barang; formulir dan berita acara menggunakan kolom khusus pada halaman aset masing-masing.
- Formulir peminjaman, perpanjangan, pengembalian, dan berita acara menggunakan kolom sesuai jenis aset; dokumen dapat dicetak/disimpan sebagai PDF melalui dialog cetak atau diekspor sebagai Word dengan kop surat.
- Pengajuan perpanjangan tersimpan di browser dan terhubung ke formulir Kendaraan, Ruangan, atau Barang yang sesuai.
- Pengembalian dan berita acara serah terima pengembalian tersimpan di browser dan terhubung ke formulir Kendaraan, Ruangan, atau Barang yang sesuai.
- Navigasi dashboard menghubungkan kartu, grafik, menu, dan transaksi ke daftar peminjaman atau formulir aset yang sesuai.
- Layanan peminjaman, perpanjangan, pengembalian, dan berita acara pada halaman masing-masing.
- Notifikasi, pengaturan tampilan, ringkasan laporan, dan unduhan laporan CSV.
- Form Permohonan mengikuti field pada konsep PDF.
- Pembuatan BAST Peminjaman dengan preview dokumen.
- Form Perpanjangan.
- Form Pengembalian.
- BAST Pengembalian dengan preview.
- Tanda tangan langsung menggunakan canvas mouse/touch untuk 3 pihak.
- Status dokumen Draft → Diajukan → Ditandatangani.
- Cetak / Save as PDF menggunakan dialog print browser.
- Data disimpan di localStorage sehingga tetap ada saat halaman direfresh pada browser yang sama.
- Formulir peminjaman, perpanjangan, pengembalian, dan berita acara yang disimpan dari alur pengguna maupun dashboard diarsipkan sebagai PDF di Google Drive dan disimpan bersama data pengajuan di Google Sheets.
- Dashboard memuat pengajuan dari Apps Script sehingga pengajuan pengguna lain juga dapat dilihat, beserta tautan unduh PDF formulir dan berita acara.
- Daftar inventaris awal merupakan data contoh prototype dan belum tersinkron ke server/database.
- `user.html` menyediakan alur pengguna untuk mengajukan peminjaman kendaraan, ruangan, atau barang, mengisi formulir dan berita acara, lalu mengirimkannya ke daftar peminjaman admin.

## Catatan

Penyimpanan pengajuan dan PDF memerlukan aktivasi backend Google Apps Script. `apps-script/Code.gs` diarahkan ke spreadsheet [Layanan BMN](https://docs.google.com/spreadsheets/d/1Q0aIq6pcrgfSpRTxijA9ZkkadSFptVqmwz_AxrKnHR4/edit), pada tab `BMN`, dan folder Drive `1NlmYXBSDJ_40F2GD0_RkO7KkKVeFFNLc`. Salin isi `apps-script/Code.gs` ke proyek Apps Script, pastikan akun pemilik deployment memiliki akses edit ke spreadsheet dan folder Drive, lalu deploy sebagai Web App dengan **Execute as: Me** dan akses yang mengizinkan pengguna aplikasi menjalankannya. Otorisasi akses Google Sheets dan Drive, lalu perbarui URL Web App pada `bmn-archive.js` jika URL deployment berubah. Perubahan kode Apps Script harus di-deploy ulang agar berlaku. Backend menyimpan data pengajuan ke Spreadsheet sebelum membuat PDF, jadi kegagalan Drive tidak menghapus data pengajuan.

Arsip PDF mencoba memakai akses “siapa saja yang memiliki link”; jika kebijakan Drive menolak pengaturan tersebut, file tetap disimpan di folder dan aplikasi menampilkan peringatan bahwa tautan berbagi tidak aktif. Jika akses link berhasil diaktifkan, siapa pun yang memperoleh tautan dapat melihat atau mengunduh dokumen. Endpoint Web App juga tidak memakai autentikasi dan menyediakan daftar pengajuan untuk dashboard, sehingga siapa pun yang mengetahui URL deployment dapat membaca data pengajuan. Batasi distribusi tautan dan jangan gunakan konfigurasi ini untuk data yang wajib dirahasiakan. Aplikasi ini belum merupakan tanda tangan elektronik tersertifikasi.
