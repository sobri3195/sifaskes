# PRD — SiFaskes

## 1. Ringkasan Produk

**Nama aplikasi/project:** sifaskes  
**Nama tampilan:** SiFaskes  
**Kepanjangan:** Sistem Informasi Fasilitas Kesehatan  
**Tagline:** Peta Profil RSAU & FKTP Jajaran TNI AU

SiFaskes adalah aplikasi web berbasis peta untuk menampilkan profil fasilitas kesehatan jajaran TNI AU di Indonesia (RSAU PNBP, RSAU BLU, dan FKTP), sekaligus mendukung pengelolaan data fasilitas secara lokal (tanpa backend).

## 2. Tujuan

1. Menyediakan visualisasi nasional lokasi fasilitas kesehatan TNI AU pada peta Indonesia.
2. Menyediakan satu sumber data profil fasilitas kesehatan yang mudah dicari dan difilter.
3. Memungkinkan update data secara cepat melalui fitur CRUD, dengan penyimpanan Local Storage.

## 3. Ruang Lingkup

### In scope
- Peta interaktif Indonesia dengan marker fasilitas.
- Popup marker dengan informasi ringkas + tombol “Lihat Detail”.
- Daftar kartu fasilitas.
- Pencarian nama fasilitas.
- Filter jenis fasilitas dan jajaran.
- CRUD data fasilitas (tambah, edit, hapus).
- Kelola koordinat dan status estimasi koordinat.
- Modal detail dengan peta mini dan rincian SDM.

### Out of scope
- Backend/API/database server.
- Autentikasi multi-user.
- Integrasi GIS lanjutan (geocoding otomatis real-time).

## 4. User Persona

1. **Staf pengelola kesehatan TNI AU**: menambahkan dan memperbarui profil fasilitas.
2. **Pimpinan/analyst internal**: melihat sebaran fasilitas, bed capacity, dan ringkasan SDM.
3. **Pengguna umum internal**: mencari informasi fasilitas berdasarkan nama/jenis/jajaran.

## 5. Kebutuhan Fungsional

1. Sistem menginisialisasi data fasilitas dari seed saat Local Storage kosong.
2. Sistem menyimpan seluruh perubahan fasilitas ke Local Storage.
3. User dapat mencari fasilitas berdasarkan nama.
4. User dapat memfilter berdasarkan:
   - Jenis: RSAU PNBP, RSAU BLU, FKTP
   - Jajaran: Kodau I, Kodau II, Kodau III, Kodiklatau, Balakpus, Korpaskgat, Koopsudnas, Laknis Mabesau
5. Marker map dapat diklik untuk menampilkan popup berisi:
   - Nama fasilitas
   - Jenis fasilitas
   - Jajaran
   - Akreditasi
   - Jumlah bed
   - Jumlah SDM
   - Tombol “Lihat Detail”
6. User dapat menambah fasilitas baru.
7. User dapat mengedit fasilitas, termasuk koordinat.
8. User dapat menghapus fasilitas.
9. Detail fasilitas ditampilkan dalam modal dengan peta mini.

## 6. Model Data Fasilitas

- `id`
- `name`
- `type` (RSAU PNBP / RSAU BLU / FKTP)
- `jajaran`
- `address`
- `latitude`
- `longitude`
- `isCoordinateEstimated`
- `accreditation`
- `bedCount`
- `sdm`:
  - `dokterUmum`
  - `dokterGigi`
  - `perawat`
  - `bidan`
  - `apoteker`
  - `tenagaAdministrasi`
  - `tenagaLainnya`
- `profileNote`
- `createdAt`
- `updatedAt`

## 7. Kebutuhan Non-Fungsional

- Stack: React + Vite + JavaScript.
- Library peta: Leaflet + React Leaflet.
- UI modern, bersih, responsif (desktop & mobile).
- Tidak ada sidebar; gunakan header/navbar atas.
- Siap deploy ke Vercel.

## 8. Kriteria Keberhasilan

1. Aplikasi bisa dijalankan langsung dengan `npm install` + `npm run dev`.
2. Marker tampil untuk setiap fasilitas seed data dan dapat diklik.
3. Semua operasi CRUD tersimpan dan persisten di Local Storage.
4. Filter dan pencarian bekerja pada peta dan daftar.
5. Deploy berhasil di Vercel tanpa konfigurasi backend tambahan.
