export interface BaseItem {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  namaDaerah: string;
  tagline: string;
  logo: string;
  favicon: string;
  warnaPrimer: string;
  warnaAksen: string;
  periode: string;
  alamat: string;
  telepon: string;
  whatsapp: string;
  email: string;
  jamLayanan: string;
  mapsEmbed: string;
  facebook: string;
  instagram: string;
  youtube: string;
  twitter: string;
  tiktok: string;
  sambutanJudul: string;
  sambutanKetua: string;
  sejarah: string;
  visi: string;
  misi: string;
  tugasFungsi: string;
  footerTentang: string;
  tautanTerkait: string;
  statAktif: boolean;
  statWilayah: string;
  statPenduduk: string;
  statLuas: string;
  statKecamatan: string;
  statKelurahan: string;
  statSumber: string;
  cuacaAktif: boolean;
  cuacaLokasi: string;
  cuacaLat: string;
  cuacaLon: string;
  tvLiveAktif: boolean;
  tvJudul: string;
  tvUrl: string;
  tvPoster: string;
  tvDeskripsi: string;
  tvJadwal: string;
}

export interface Slide extends BaseItem {
  judul: string;
  subjudul: string;
  gambar: string;
  tombolTeks: string;
  tombolLink: string;
  urutan: number;
  aktif: boolean;
}

export interface Berita extends BaseItem {
  judul: string;
  slug: string;
  ringkasan: string;
  konten: string;
  gambar: string;
  kategori: string;
  penulis: string;
  tanggal: string;
  unggulan: boolean;
  publish: boolean;
}

export interface Agenda extends BaseItem {
  judul: string;
  jenis: string;
  tanggal: string;
  waktuMulai: string;
  waktuSelesai: string;
  lokasi: string;
  komisiId: string;
  status: string;
  deskripsi: string;
  disiarkan: boolean;
}

export interface Anggota extends BaseItem {
  nama: string;
  slug: string;
  foto: string;
  jabatan: string;
  fraksiId: string;
  komisiId: string;
  dapil: string;
  tempatLahir: string;
  tanggalLahir: string;
  pendidikan: string;
  email: string;
  bio: string;
  urutan: number;
}

export interface Fraksi extends BaseItem {
  nama: string;
  slug: string;
  singkatan: string;
  logo: string;
  warna: string;
  ketuaId: string;
  sekretarisId: string;
  deskripsi: string;
  urutan: number;
}

export interface Komisi extends BaseItem {
  nama: string;
  slug: string;
  jenis: string;
  bidang: string;
  deskripsi: string;
  mitraKerja: string;
  ketuaId: string;
  wakilKetuaId: string;
  sekretarisId: string;
  anggotaIds: string[];
  urutan: number;
}

export interface Video extends BaseItem {
  judul: string;
  url: string;
  thumbnail: string;
  kategori: string;
  tanggal: string;
  deskripsi: string;
}

export interface Aspirasi extends BaseItem {
  kode: string;
  nama: string;
  email: string;
  telepon: string;
  alamat: string;
  kategori: string;
  komisiId: string;
  judul: string;
  isi: string;
  lampiran: string;
  status: string;
  tanggapan: string;
  tampilPublik: boolean;
  anonim: boolean;
}

export interface Dokumen extends BaseItem {
  judul: string;
  jenis: string;
  nomor: string;
  tahun: string;
  tanggal: string;
  file: string;
  deskripsi: string;
}

export interface Galeri extends BaseItem {
  judul: string;
  gambar: string;
  keterangan: string;
  tanggal: string;
}

export interface User extends BaseItem {
  username: string;
  nama: string;
  role: "admin" | "editor";
  passwordHash: string;
}

export interface DB {
  settings: Settings;
  slides: Slide[];
  berita: Berita[];
  agenda: Agenda[];
  anggota: Anggota[];
  fraksi: Fraksi[];
  komisi: Komisi[];
  videos: Video[];
  aspirasi: Aspirasi[];
  dokumen: Dokumen[];
  galeri: Galeri[];
  users: User[];
}

export type CollectionName = Exclude<keyof DB, "settings">;
