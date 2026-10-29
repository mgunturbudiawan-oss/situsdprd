import type { CollectionName } from "./types";

export type FieldType =
  | "text" | "textarea" | "richtext" | "image" | "file" | "date" | "time" | "number"
  | "checkbox" | "select" | "relation" | "multirelation" | "color" | "password" | "url" | "email";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  relation?: CollectionName;
  help?: string;
  placeholder?: string;
  section?: string;
  full?: boolean;
}

export interface Resource {
  key: CollectionName;
  label: string;
  singular: string;
  icon: string;
  group: "Konten" | "Kelembagaan" | "Layanan" | "Sistem";
  titleField: string;
  columns: string[];
  sort: { field: string; dir: "asc" | "desc" };
  slugFrom?: string;
  adminOnly?: boolean;
  publicPath?: string;
  fields: Field[];
}

export const JENIS_AGENDA = ["Rapat Paripurna", "Rapat Komisi", "Rapat Badan", "Rapat Kerja", "Rapat Dengar Pendapat", "Kunjungan Kerja", "Reses", "Audiensi", "Lainnya"];
export const STATUS_AGENDA = ["Terjadwal", "Berlangsung", "Selesai", "Ditunda", "Dibatalkan"];
export const KATEGORI_BERITA = ["Paripurna", "Komisi", "Legislasi", "Anggaran", "Pengawasan", "Reses", "Aspirasi", "Kelembagaan", "Pengumuman"];
export const JENIS_DOKUMEN = ["Peraturan Daerah", "Rancangan Perda", "Keputusan DPRD", "Keputusan Pimpinan", "Laporan", "Lainnya"];
export const JABATAN = ["Ketua DPRD", "Wakil Ketua DPRD", "Anggota"];
export const KATEGORI_ASPIRASI = ["Infrastruktur", "Pendidikan", "Kesehatan", "Ekonomi", "Sosial", "Pemerintahan", "Lingkungan", "Hukum", "Lainnya"];
export const STATUS_ASPIRASI = ["Baru", "Diproses", "Ditindaklanjuti", "Selesai", "Ditolak"];

export const RESOURCES: Resource[] = [
  {
    key: "slides",
    label: "Hero Slider",
    singular: "Slide",
    icon: "images",
    group: "Konten",
    titleField: "judul",
    columns: ["gambar", "judul", "urutan", "aktif"],
    sort: { field: "urutan", dir: "asc" },
    fields: [
      { name: "judul", label: "Nama Slide", type: "text", required: true, full: true, help: "Hanya sebagai penanda di CMS (tidak tampil di situs)" },
      { name: "gambar", label: "Gambar Latar (disarankan 1920×1080)", type: "image", full: true },
      { name: "kredit", label: "Kredit Foto", type: "text", full: true, help: "Wajib diisi untuk foto berlisensi Creative Commons, mis. \"Foto: Nama / Wikimedia Commons (CC BY 2.0)\". Kosongkan untuk foto milik sendiri." },
      { name: "subjudul", label: "Keterangan", type: "textarea", full: true, help: "Kalimat singkat di bawah kotak pencarian hero (tampil di tablet & desktop)" },
      { name: "urutan", label: "Urutan", type: "number" },
      { name: "aktif", label: "Tampilkan", type: "checkbox" },
    ],
  },
  {
    key: "berita",
    label: "Berita",
    singular: "Berita",
    icon: "newspaper",
    group: "Konten",
    titleField: "judul",
    columns: ["gambar", "judul", "kategori", "tanggal", "publish"],
    sort: { field: "tanggal", dir: "desc" },
    slugFrom: "judul",
    publicPath: "/berita/:slug",
    fields: [
      { name: "judul", label: "Judul", type: "text", required: true, full: true },
      { name: "slug", label: "Slug URL", type: "text", help: "Kosongkan untuk dibuat otomatis dari judul", full: true },
      { name: "ringkasan", label: "Ringkasan", type: "textarea", full: true },
      { name: "konten", label: "Isi Berita", type: "richtext", required: true, full: true },
      { name: "gambar", label: "Gambar Utama", type: "image", full: true },
      { name: "kategori", label: "Kategori", type: "select", options: KATEGORI_BERITA },
      { name: "tanggal", label: "Tanggal", type: "date", required: true },
      { name: "penulis", label: "Penulis", type: "text" },
      { name: "unggulan", label: "Berita Unggulan", type: "checkbox" },
      { name: "publish", label: "Terbitkan", type: "checkbox" },
    ],
  },
  {
    key: "agenda",
    label: "Agenda",
    singular: "Agenda",
    icon: "calendar",
    group: "Konten",
    titleField: "judul",
    columns: ["judul", "jenis", "tanggal", "status", "disiarkan"],
    sort: { field: "tanggal", dir: "desc" },
    publicPath: "/agenda/:id",
    fields: [
      { name: "judul", label: "Nama Kegiatan", type: "text", required: true, full: true },
      { name: "jenis", label: "Jenis Kegiatan", type: "select", options: JENIS_AGENDA },
      { name: "status", label: "Status", type: "select", options: STATUS_AGENDA },
      { name: "tanggal", label: "Tanggal", type: "date", required: true },
      { name: "lokasi", label: "Lokasi", type: "text" },
      { name: "waktuMulai", label: "Waktu Mulai", type: "time" },
      { name: "waktuSelesai", label: "Waktu Selesai", type: "time" },
      { name: "komisiId", label: "Komisi / Badan Terkait", type: "relation", relation: "komisi" },
      { name: "disiarkan", label: "Disiarkan di TV DPRD", type: "checkbox" },
      { name: "deskripsi", label: "Deskripsi", type: "richtext", full: true },
    ],
  },
  {
    key: "videos",
    label: "Video TV DPRD",
    singular: "Video",
    icon: "film",
    group: "Konten",
    titleField: "judul",
    columns: ["thumbnail", "judul", "kategori", "tanggal"],
    sort: { field: "tanggal", dir: "desc" },
    publicPath: "/tv?v=:id",
    fields: [
      { name: "judul", label: "Judul Video", type: "text", required: true, full: true },
      { name: "url", label: "URL Video", type: "text", required: true, full: true, help: "Link YouTube, file .mp4, atau stream .m3u8" },
      { name: "thumbnail", label: "Thumbnail", type: "image", full: true, help: "Opsional untuk video YouTube (otomatis)" },
      { name: "kategori", label: "Kategori", type: "text" },
      { name: "tanggal", label: "Tanggal", type: "date" },
      { name: "deskripsi", label: "Deskripsi", type: "textarea", full: true },
    ],
  },
  {
    key: "galeri",
    label: "Galeri Foto",
    singular: "Foto",
    icon: "camera",
    group: "Konten",
    titleField: "judul",
    columns: ["gambar", "judul", "tanggal"],
    sort: { field: "tanggal", dir: "desc" },
    fields: [
      { name: "judul", label: "Judul", type: "text", required: true, full: true },
      { name: "gambar", label: "Foto", type: "image", required: true, full: true },
      { name: "tanggal", label: "Tanggal", type: "date" },
      { name: "keterangan", label: "Keterangan", type: "textarea", full: true },
    ],
  },
  {
    key: "dokumen",
    label: "Produk Hukum",
    singular: "Dokumen",
    icon: "file",
    group: "Konten",
    titleField: "judul",
    columns: ["judul", "jenis", "nomor", "tahun"],
    sort: { field: "tanggal", dir: "desc" },
    fields: [
      { name: "judul", label: "Judul Dokumen", type: "text", required: true, full: true },
      { name: "jenis", label: "Jenis", type: "select", options: JENIS_DOKUMEN },
      { name: "nomor", label: "Nomor", type: "text" },
      { name: "tahun", label: "Tahun", type: "text" },
      { name: "tanggal", label: "Tanggal Penetapan", type: "date" },
      { name: "file", label: "File Dokumen (PDF/DOC)", type: "file", full: true },
      { name: "deskripsi", label: "Keterangan", type: "textarea", full: true },
    ],
  },
  {
    key: "anggota",
    label: "Anggota Dewan",
    singular: "Anggota",
    icon: "users",
    group: "Kelembagaan",
    titleField: "nama",
    columns: ["foto", "nama", "jabatan", "fraksiId", "komisiId"],
    sort: { field: "urutan", dir: "asc" },
    slugFrom: "nama",
    publicPath: "/anggota/:slug",
    fields: [
      { name: "nama", label: "Nama Lengkap & Gelar", type: "text", required: true, full: true },
      { name: "slug", label: "Slug URL", type: "text", help: "Kosongkan untuk otomatis", full: true },
      { name: "foto", label: "Foto (rasio 3:4)", type: "image", full: true },
      { name: "jabatan", label: "Jabatan", type: "select", options: JABATAN },
      { name: "urutan", label: "Urutan Tampil", type: "number" },
      { name: "fraksiId", label: "Fraksi", type: "relation", relation: "fraksi" },
      { name: "komisiId", label: "Komisi", type: "relation", relation: "komisi" },
      { name: "dapil", label: "Daerah Pemilihan", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "tempatLahir", label: "Tempat Lahir", type: "text" },
      { name: "tanggalLahir", label: "Tanggal Lahir", type: "date" },
      { name: "pendidikan", label: "Pendidikan Terakhir", type: "text", full: true },
      { name: "bio", label: "Biografi", type: "richtext", full: true },
    ],
  },
  {
    key: "fraksi",
    label: "Fraksi",
    singular: "Fraksi",
    icon: "flag",
    group: "Kelembagaan",
    titleField: "nama",
    columns: ["logo", "nama", "singkatan", "ketuaId"],
    sort: { field: "urutan", dir: "asc" },
    slugFrom: "singkatan",
    publicPath: "/fraksi/:slug",
    fields: [
      { name: "nama", label: "Nama Fraksi", type: "text", required: true, full: true },
      { name: "singkatan", label: "Singkatan", type: "text", required: true },
      { name: "slug", label: "Slug URL", type: "text", help: "Kosongkan untuk otomatis" },
      { name: "logo", label: "Logo", type: "image", full: true },
      { name: "warna", label: "Warna Identitas", type: "color" },
      { name: "urutan", label: "Urutan", type: "number" },
      { name: "ketuaId", label: "Ketua Fraksi", type: "relation", relation: "anggota" },
      { name: "sekretarisId", label: "Sekretaris Fraksi", type: "relation", relation: "anggota" },
      { name: "deskripsi", label: "Deskripsi", type: "richtext", full: true },
    ],
  },
  {
    key: "komisi",
    label: "Komisi & Badan",
    singular: "Komisi / Badan",
    icon: "landmark",
    group: "Kelembagaan",
    titleField: "nama",
    columns: ["nama", "jenis", "bidang", "ketuaId"],
    sort: { field: "urutan", dir: "asc" },
    slugFrom: "nama",
    publicPath: "/komisi/:slug",
    fields: [
      { name: "nama", label: "Nama", type: "text", required: true, full: true },
      { name: "slug", label: "Slug URL", type: "text", help: "Kosongkan untuk otomatis" },
      { name: "jenis", label: "Jenis", type: "select", options: ["Komisi", "Badan", "Panitia Khusus"] },
      { name: "bidang", label: "Bidang", type: "text", full: true },
      { name: "urutan", label: "Urutan", type: "number" },
      { name: "ketuaId", label: "Ketua", type: "relation", relation: "anggota" },
      { name: "wakilKetuaId", label: "Wakil Ketua", type: "relation", relation: "anggota" },
      { name: "sekretarisId", label: "Sekretaris", type: "relation", relation: "anggota" },
      { name: "deskripsi", label: "Tugas & Deskripsi", type: "richtext", full: true },
      { name: "mitraKerja", label: "Mitra Kerja (satu per baris)", type: "textarea", full: true },
      {
        name: "anggotaIds",
        label: "Anggota Tambahan",
        type: "multirelation",
        relation: "anggota",
        full: true,
        help: "Anggota yang komisinya diatur di menu Anggota Dewan otomatis masuk. Centang di sini untuk keanggotaan badan/pansus.",
      },
    ],
  },
  {
    key: "users",
    label: "Pengguna",
    singular: "Pengguna",
    icon: "shield",
    group: "Sistem",
    titleField: "nama",
    columns: ["username", "nama", "role"],
    sort: { field: "username", dir: "asc" },
    adminOnly: true,
    fields: [
      { name: "username", label: "Username", type: "text", required: true },
      { name: "nama", label: "Nama", type: "text", required: true },
      { name: "role", label: "Peran", type: "select", options: ["admin", "editor"], help: "Editor tidak dapat mengubah pengaturan & pengguna" },
      { name: "password", label: "Password", type: "password", help: "Kosongkan jika tidak ingin mengubah (minimal 6 karakter)" },
    ],
  },
];

export function getResource(key: string) {
  return RESOURCES.find((r) => r.key === key);
}

export const SETTINGS_FIELDS: Field[] = [
  { name: "namaDaerah", label: "Nama Daerah", type: "text", required: true, section: "Identitas", help: "Contoh: Kota Ternate" },
  { name: "tagline", label: "Tagline / Slogan", type: "text", section: "Identitas" },
  { name: "periode", label: "Periode Keanggotaan", type: "text", section: "Identitas" },
  { name: "logo", label: "Logo Daerah", type: "image", section: "Identitas", help: "PNG transparan disarankan" },
  { name: "favicon", label: "Favicon", type: "image", section: "Identitas" },
  { name: "warnaPrimer", label: "Warna Utama", type: "color", section: "Tampilan" },
  { name: "warnaAksen", label: "Warna Aksen", type: "color", section: "Tampilan" },
  { name: "alamat", label: "Alamat", type: "textarea", section: "Kontak", full: true },
  { name: "telepon", label: "Telepon", type: "text", section: "Kontak" },
  { name: "whatsapp", label: "WhatsApp (format 62xxx)", type: "text", section: "Kontak" },
  { name: "email", label: "Email", type: "email", section: "Kontak" },
  { name: "jamLayanan", label: "Jam Layanan", type: "text", section: "Kontak" },
  { name: "mapsEmbed", label: "URL Embed Google Maps", type: "url", section: "Kontak", full: true },
  { name: "facebook", label: "Facebook", type: "url", section: "Media Sosial" },
  { name: "instagram", label: "Instagram", type: "url", section: "Media Sosial" },
  { name: "youtube", label: "YouTube", type: "url", section: "Media Sosial" },
  { name: "twitter", label: "X / Twitter", type: "url", section: "Media Sosial" },
  { name: "tiktok", label: "TikTok", type: "url", section: "Media Sosial" },
  { name: "sambutanJudul", label: "Judul Sambutan", type: "text", section: "Profil Lembaga", full: true },
  { name: "sambutanKetua", label: "Sambutan Ketua DPRD", type: "richtext", section: "Profil Lembaga", full: true },
  { name: "sejarah", label: "Sejarah", type: "richtext", section: "Profil Lembaga", full: true },
  { name: "visi", label: "Visi", type: "textarea", section: "Profil Lembaga", full: true },
  { name: "misi", label: "Misi (satu per baris)", type: "textarea", section: "Profil Lembaga", full: true },
  { name: "tugasFungsi", label: "Tugas & Fungsi", type: "richtext", section: "Profil Lembaga", full: true },
  { name: "footerTentang", label: "Deskripsi Singkat (Footer)", type: "textarea", section: "Profil Lembaga", full: true },
  { name: "tautanTerkait", label: "Ruang Informasi / Tautan Terkait", type: "textarea", section: "Kontak", full: true, help: "Satu tautan per baris, format: Nama | URL" },
  { name: "statAktif", label: "Tampilkan data wilayah di bawah hero", type: "checkbox", section: "Data Wilayah", full: true },
  { name: "statWilayah", label: "Nama Wilayah", type: "text", section: "Data Wilayah", placeholder: "Kota Ternate" },
  { name: "statPenduduk", label: "Jumlah Penduduk (jiwa)", type: "text", section: "Data Wilayah", placeholder: "216.175" },
  { name: "statLuas", label: "Luas Wilayah (km²)", type: "text", section: "Data Wilayah", placeholder: "111,39" },
  { name: "statKecamatan", label: "Jumlah Kecamatan", type: "text", section: "Data Wilayah", placeholder: "8" },
  { name: "statKelurahan", label: "Jumlah Kelurahan", type: "text", section: "Data Wilayah", placeholder: "77" },
  { name: "statSumber", label: "Sumber Data", type: "text", section: "Data Wilayah", full: true, help: "Ditampilkan sebagai keterangan kecil di bawah angka" },
  { name: "cuacaAktif", label: "Tampilkan widget cuaca & kualitas udara di hero", type: "checkbox", section: "Widget Cuaca", full: true },
  { name: "cuacaLokasi", label: "Nama Lokasi", type: "text", section: "Widget Cuaca", placeholder: "Contoh: Ternate" },
  { name: "cuacaLat", label: "Latitude", type: "text", section: "Widget Cuaca", placeholder: "-6.2088" },
  { name: "cuacaLon", label: "Longitude", type: "text", section: "Widget Cuaca", placeholder: "106.8456", help: "Klik kanan lokasi di Google Maps untuk menyalin koordinat" },
];

export const TV_FIELDS: Field[] = [
  { name: "tvLiveAktif", label: "Siaran langsung sedang AKTIF", type: "checkbox", section: "Siaran Langsung", full: true },
  { name: "tvJudul", label: "Judul Siaran", type: "text", section: "Siaran Langsung", full: true },
  { name: "tvUrl", label: "URL Stream", type: "text", section: "Siaran Langsung", full: true, help: "YouTube Live (https://youtube.com/live/...), HLS (.m3u8), MP4, atau URL embed lain" },
  { name: "tvPoster", label: "Poster / Gambar Saat Offline", type: "image", section: "Siaran Langsung", full: true },
  { name: "tvDeskripsi", label: "Deskripsi", type: "textarea", section: "Siaran Langsung", full: true },
  { name: "tvJadwal", label: "Jadwal Siaran", type: "textarea", section: "Jadwal", full: true, help: "Satu baris per jadwal, format: Hari | Jam | Program" },
];
