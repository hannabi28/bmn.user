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
- Daftar inventaris awal merupakan data contoh prototype dan belum tersinkron ke server/database.
- `user.html` menyediakan alur pengguna untuk mengajukan peminjaman kendaraan, ruangan, atau barang, mengisi formulir dan berita acara, lalu mengirimkannya ke daftar peminjaman admin.

## Catatan

Ini adalah prototype frontend, belum memakai backend/database dan belum merupakan tanda tangan elektronik tersertifikasi. Untuk produksi, bagian tanda tangan dan autentikasi perlu dihubungkan ke backend serta mekanisme TTE/sertifikat yang berlaku.
