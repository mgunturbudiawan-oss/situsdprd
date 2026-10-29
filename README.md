# Portal DPRD — Next.js + Tailwind CSS

Situs resmi DPRD lengkap dengan CMS. Nama daerah, logo, warna tema, dan seluruh konten diatur dari halaman admin, jadi satu kode ini bisa dipakai untuk DPRD kabupaten, kota, atau provinsi mana pun.

## Menjalankan di komputer sendiri

Butuh Node.js 22 atau lebih baru.

```bash
npm install
npm run dev          # http://localhost:3000
# produksi
npm run build && npm start
```

**Login CMS:** `http://localhost:3000/admin`, username `admin`, password `admin123`. **Segera ganti** lewat menu *Akun Saya*.

Tanpa pengaturan apa pun, data disimpan di `storage/db.json` dan file unggahan di `storage/uploads/`. Data contoh dibuat otomatis saat situs pertama kali dibuka.

## Deploy ke Vercel

Disk server di Vercel tidak permanen, jadi data dan file unggahan **wajib** disimpan di layanan terpisah:

| Kebutuhan | Layanan | Environment variable |
|---|---|---|
| Database | PostgreSQL: **Neon** (lewat Vercel Marketplace), Supabase, atau Postgres lain | `DATABASE_URL` |
| File unggahan (foto, PDF) | **Vercel Blob** | `BLOB_READ_WRITE_TOKEN` |
| Kunci sesi login | — | `AUTH_SECRET` |

Langkah-langkahnya:

1. Di [vercel.com](https://vercel.com): **Add New → Project**, lalu impor repositori GitHub ini. Framework terdeteksi otomatis sebagai Next.js.
2. Buka **Storage** di project tersebut:
   - **Create Database → Neon (Postgres)**, lalu hubungkan ke project. `DATABASE_URL` akan terisi otomatis.
   - **Create → Blob**, lalu hubungkan ke project. `BLOB_READ_WRITE_TOKEN` akan terisi otomatis.
3. Buka **Settings → Environment Variables**, lalu tambahkan `AUTH_SECRET` berisi string acak panjang. Contoh cara membuatnya:
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
4. **Redeploy** project.
5. Saat situs pertama kali dibuka, tabel `dprd_store` dibuat otomatis dan diisi data contoh. Login ke `/admin` dengan `admin` / `admin123`, lalu **segera ganti password**.

### Memindahkan data dari komputer lokal ke database online (opsional)

Kalau Anda sudah mengisi konten di komputer sendiri (`storage/db.json`), konten itu bisa dipindahkan ke Postgres dan Blob:

```bash
# Buat file .env.local berisi DATABASE_URL dan BLOB_READ_WRITE_TOKEN dari Vercel
# (Settings → Environment Variables, atau jalankan: npx vercel env pull .env.local)
npm run db:import             # menolak bila database tujuan sudah berisi data
npm run db:import -- --force  # menimpa data di database tujuan
```

Skrip ini mengunggah file di `storage/uploads/` ke Vercel Blob, mengganti URL-nya di data, lalu menulis semuanya ke tabel `dprd_store`.

### Batasan di Vercel

- Ukuran unggahan maksimal **4 MB per file**, karena Vercel membatasi body request sekitar 4,5 MB. Di server sendiri (VPS) batasnya 25 MB.
- Cache widget cuaca dan pembatas percobaan login disimpan di memori, jadi bisa ter-reset sewaktu-waktu di lingkungan serverless. Ini tidak memengaruhi data.

## Fitur Situs Publik

| Halaman | Isi |
|---|---|
| **Beranda** | Hero carousel layar penuh (parallax, kotak pencarian, widget cuaca & kualitas udara), Layanan Cepat, Berita Dewan + Agenda, data wilayah, TV DPRD, dokumen & rapat terbaru, pimpinan & fraksi |
| **Profil** | Sambutan, sejarah, visi & misi, tugas & fungsi, halaman pimpinan |
| **Anggota Dewan** | Daftar dengan filter fraksi/komisi dan pencarian, halaman profil tiap anggota |
| **Fraksi** | Grafik komposisi kursi, detail fraksi beserta anggotanya |
| **Komisi & Badan** | Komisi I–IV dan alat kelengkapan (Banmus, Banggar, Bapemperda, BK), mitra kerja, susunan anggota |
| **Agenda** | Kalender bulanan dan daftar kegiatan, filter jenis, detail agenda, penanda "disiarkan" |
| **TV DPRD** | Siaran langsung (YouTube Live / HLS `.m3u8` / MP4 / embed), jadwal siaran, arsip video per kategori. Badge **LIVE** muncul otomatis di header |
| **Aspirasi Rakyat** | Formulir dengan lampiran, kode pelacakan, halaman lacak status (timeline), daftar aspirasi yang sudah ditanggapi |
| **Produk Hukum** | Perda, raperda, keputusan DPRD; filter jenis/tahun; unduh file |
| **Berita, Galeri (lightbox), Kontak (peta), Pencarian global** | |

Tampilan dibuat ramah HP: navigasi bawah ala aplikasi, strip menu geser, dan drawer menu.

## Fitur CMS (`/admin`)

- **Dashboard**: statistik, aspirasi terbaru, agenda mendatang, tombol cepat *Mulai/Hentikan Live*
- **Konten**: Hero Slider, Berita, Agenda, Siaran Langsung, Video, Galeri, Produk Hukum
- **Kelembagaan**: Anggota Dewan, Fraksi, Komisi & Badan (relasi ketua/wakil/sekretaris/anggota)
- **Aspirasi**: filter status, ubah status, teruskan ke komisi, beri tanggapan, tampilkan ke publik
- **Pengaturan Situs**: nama daerah, tagline, periode, logo, favicon, **warna utama & aksen** (seluruh tema ikut berubah), kontak, WhatsApp, Google Maps, media sosial, tautan terkait, data wilayah, widget cuaca, teks profil
- **Pengguna**: peran `admin` dan `editor` (editor tidak bisa membuka pengaturan dan manajemen pengguna)
- **Editor visual** (TipTap) untuk konten panjang: judul, tebal, miring, garis bawah, coret, stabilo, sub/superskrip, perataan, daftar, kutipan, tautan, gambar (unggah/URL), video YouTube, tabel, mode HTML, dan layar penuh. HTML disaring dengan allowlist saat disimpan dan saat ditampilkan

## Struktur

```
app/(site)/          halaman publik
app/admin/           login + panel CMS (actions.ts = server actions)
app/api/             widget cuaca & unggah gambar editor
app/uploads/         menyajikan file unggahan lokal (bila tidak memakai Vercel Blob)
components/site/     komponen situs (Header, HeroSlider, LivePlayer, ...)
components/admin/    komponen CMS (ResourceForm generik, RichTextEditor, Sidebar, ...)
lib/db.ts            lapisan data: PostgreSQL (DATABASE_URL) atau file JSON
lib/upload.ts        unggahan: Vercel Blob (BLOB_READ_WRITE_TOKEN) atau folder lokal
lib/resources.ts     definisi menu & field CMS (tambah field/menu di sini)
lib/seed.ts          data contoh awal
scripts/db-import.mjs  pindahkan data lokal ke Postgres + Blob
storage/             data lokal (diabaikan git)
```

## Catatan

- **Penyimpanan data.** Setiap kunci (`settings`, `berita`, `agenda`, dan seterusnya) disimpan sebagai satu dokumen JSON. Di Postgres bentuknya satu baris di tabel `dprd_store`. Perubahan berjalan dalam transaksi dengan penguncian baris, jadi penyimpanan bersamaan tidak saling menimpa. Model ini cocok untuk skala situs DPRD (ratusan hingga ribuan konten).
- **Backup.** Di lokal cukup salin folder `storage/`. Di Postgres gunakan fitur backup penyedia (misalnya *branching/restore* di Neon).
- `npm run reset-data` menghapus `storage/db.json` lokal. Data contoh dibuat ulang saat situs dibuka lagi.
- **Foto hero** ada di `public/images/hero/`. Sumbernya Wikimedia Commons, semuanya berlisensi **Public Domain**: *Sidang Paripurna DPR ke-9 2015*, *MPRDPRBuilding*, dan *Gedung DPRD NTB*. Sebaiknya ganti dengan foto gedung dan kegiatan DPRD sendiri lewat menu Hero Slider.
- Gambar berita dan galeri contoh memakai picsum.photos, dan video contoh memakai stream uji publik (Mux/Google). Ganti semuanya dari CMS.
- **Widget cuaca & kualitas udara** mengambil data dari [Open-Meteo](https://open-meteo.com), yang gratis dan tanpa API key, dengan cache 10 menit. Atur lokasi di *Pengaturan Situs → Widget Cuaca*. Indeks udara memakai skala AQI (US) dengan label kategori seperti ISPU.
- **Data wilayah** (penduduk, luas, kecamatan, kelurahan) diatur di *Pengaturan Situs → Data Wilayah*. Periksa kembali angkanya dengan data resmi BPS/Pemkot sebelum dipublikasikan.
