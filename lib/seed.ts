import type { Agenda, Anggota, Aspirasi, Berita, DB, Dokumen, Fraksi, Galeri, Komisi, Settings, Slide, Video } from "./types";
import { hashPassword } from "./password";
import { slugify } from "./utils";

export const DEFAULT_SETTINGS: Settings = {
  namaDaerah: "Kota Ternate",
  tagline: "Bersama Rakyat Membangun Kota Ternate",
  logo: "/images/lambang-kota-ternate.png",
  favicon: "/images/lambang-kota-ternate.png",
  warnaPrimer: "#0b5ea8",
  warnaAksen: "#f2b705",
  periode: "2024–2029",
  // Kontak resmi sengaja dikosongkan (tidak ditampilkan) sampai diisi Sekretariat DPRD lewat CMS
  alamat: "Kota Ternate, Provinsi Maluku Utara",
  telepon: "",
  whatsapp: "",
  email: "",
  jamLayanan: "Senin – Jumat, 08.00 – 16.00 WIT",
  mapsEmbed: "https://www.google.com/maps?q=DPRD+Kota+Ternate&output=embed",
  facebook: "",
  instagram: "",
  youtube: "",
  twitter: "",
  tiktok: "",
  sambutanJudul: "Sambutan Ketua DPRD",
  sambutanKetua:
    "Assalamu'alaikum warahmatullahi wabarakatuh, salam sejahtera bagi kita semua.\n\nPuji syukur kita panjatkan ke hadirat Tuhan Yang Maha Esa. Portal resmi ini kami hadirkan sebagai wujud komitmen DPRD untuk menjadi lembaga yang terbuka, transparan, dan dekat dengan masyarakat.\n\nMelalui portal ini, masyarakat dapat mengikuti agenda kegiatan dewan, menyaksikan siaran langsung rapat, mengakses produk hukum, serta menyampaikan aspirasi secara langsung kepada wakil rakyat. Mari bersama-sama kita wujudkan pembangunan daerah yang adil, maju, dan sejahtera.",
  sejarah:
    "Dewan Perwakilan Rakyat Daerah (DPRD) Kota Ternate merupakan lembaga perwakilan rakyat daerah yang berkedudukan sebagai unsur penyelenggara pemerintahan daerah Kota Ternate, Provinsi Maluku Utara.\n\nTernate memiliki sejarah panjang sebagai pusat Kesultanan Ternate dan jalur rempah dunia. Dalam perjalanan pemerintahan modern, Ternate berstatus kota administratif sebelum ditetapkan sebagai daerah otonom (kotamadya) pada tahun 1999, sehingga memiliki DPRD sendiri sebagai wadah perwakilan masyarakat.\n\nSeiring perkembangan sistem ketatanegaraan, kedudukan dan peran DPRD terus diperkuat melalui berbagai peraturan perundang-undangan, termasuk Undang-Undang Nomor 23 Tahun 2014 tentang Pemerintahan Daerah. Hingga kini, DPRD Kota Ternate terus berbenah untuk mewujudkan lembaga legislatif yang aspiratif, akuntabel, dan responsif terhadap kebutuhan masyarakat.",
  visi: "Terwujudnya DPRD yang aspiratif, transparan, dan berintegritas dalam mewujudkan masyarakat yang sejahtera dan berkeadilan.",
  misi:
    "Meningkatkan kualitas pembentukan peraturan daerah yang berpihak kepada rakyat\nMengoptimalkan fungsi anggaran untuk kesejahteraan masyarakat\nMemperkuat fungsi pengawasan terhadap penyelenggaraan pemerintahan daerah\nMeningkatkan penyerapan dan tindak lanjut aspirasi masyarakat\nMewujudkan tata kelola kelembagaan yang modern dan terbuka",
  tugasFungsi:
    "## Fungsi DPRD\n- **Fungsi Pembentukan Perda** — membentuk peraturan daerah bersama kepala daerah.\n- **Fungsi Anggaran** — membahas dan memberikan persetujuan rancangan APBD.\n- **Fungsi Pengawasan** — mengawasi pelaksanaan perda dan APBD.\n\n## Tugas dan Wewenang\n1. Membentuk perda bersama kepala daerah.\n2. Membahas dan memberikan persetujuan rancangan perda mengenai APBD.\n3. Melaksanakan pengawasan terhadap pelaksanaan perda dan APBD.\n4. Memilih kepala daerah atau wakil kepala daerah dalam hal terjadi kekosongan jabatan.\n5. Meminta laporan keterangan pertanggungjawaban kepala daerah.\n6. Menyerap, menghimpun, dan menindaklanjuti aspirasi masyarakat.",
  footerTentang:
    "Portal resmi Dewan Perwakilan Rakyat Daerah Kota Ternate sebagai sarana informasi publik, transparansi kegiatan dewan, dan penyaluran aspirasi masyarakat.",
  tautanTerkait:
    "Pemerintah Kota Ternate | https://ternatekota.go.id\nPemerintah Provinsi Maluku Utara | https://malutprov.go.id\nBPS Kota Ternate | https://ternatekota.bps.go.id\nDPR RI | https://www.dpr.go.id\nJDIH — Produk Hukum | /dokumen\nPPID — Informasi Publik | /kontak",
  statAktif: false,
  statWilayah: "Kota Ternate",
  statPenduduk: "216.175",
  statLuas: "111,39",
  statKecamatan: "8",
  statKelurahan: "77",
  statSumber: "BPS Kota Ternate (Kota Ternate Dalam Angka 2026, data 2025) & Kemendagri",
  cuacaAktif: true,
  cuacaLokasi: "Ternate",
  cuacaLat: "0.7893",
  cuacaLon: "127.3770",
  tvLiveAktif: true,
  tvJudul: "Siaran Langsung Rapat Paripurna DPRD Kota Ternate",
  tvUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  tvPoster: "/images/hero/paripurna.jpg",
  tvDeskripsi:
    "Saksikan secara langsung jalannya rapat-rapat DPRD. Siaran ini merupakan wujud keterbukaan informasi kepada masyarakat.",
  tvJadwal:
    "Senin | 09.00 WIT | Rapat Paripurna\nRabu | 10.00 WIT | Rapat Dengar Pendapat Komisi\nJumat | 14.00 WIT | Dialog Wakil Rakyat\nSabtu | 19.00 WIT | Pekan Legislasi (Siaran Ulang)",
};

const img = (seed: string, w = 1200, h = 800) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

export function createSeed(): DB {
  const now = new Date();
  const iso = now.toISOString();
  const day = (offset: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + offset);
    return d.toISOString().slice(0, 10);
  };
  const base = (id: string) => ({ id, createdAt: iso, updatedAt: iso });

  const fraksiDef: [string, string, string, number][] = [
    ["Fraksi PDI Perjuangan", "PDI-P", "#c8102e", 7],
    ["Fraksi Partai Golkar", "Golkar", "#e8c300", 6],
    ["Fraksi Partai Gerindra", "Gerindra", "#8b1a1a", 6],
    ["Fraksi PKB", "PKB", "#00843d", 5],
    ["Fraksi Partai NasDem", "NasDem", "#1b3f8b", 4],
    ["Fraksi PKS", "PKS", "#f47c20", 3],
    ["Fraksi Partai Demokrat", "Demokrat", "#1f5aa6", 2],
    ["Fraksi PAN", "PAN", "#0067b1", 2],
  ];

  const names = [
    "H. Bambang Sutrisno, S.E., M.M.", "Dra. Hj. Siti Rahmawati", "Ir. Agus Setiawan, M.T.", "Dr. Hendra Gunawan, S.H., M.H.",
    "Rina Marlina, S.Pd.", "H. Dedi Kurniawan", "Yusuf Hidayat, S.Ag.", "Nurhayati, S.Kep.", "Andi Pratama, S.T.",
    "Hj. Lilis Suryani, S.E.", "Rudi Hartono", "Teguh Santoso, S.Sos.", "Dewi Lestari, S.H.", "Ahmad Fauzi, Lc.",
    "Eko Prasetyo, S.Kom.", "Sri Wahyuni, S.Pd.I.", "Joko Susilo", "Fitri Handayani, S.Psi.", "H. Mulyadi, S.IP.",
    "Wahyu Nugroho, S.T., M.Eng.", "Indah Permatasari", "Arif Rahman Hakim, S.H.", "Supriyadi, S.Pt.", "Maya Sari, S.E., Ak.",
    "Hasan Basri", "Kartika Dewi, M.Pd.", "Fajar Ramadhan, S.I.Kom.", "Asep Saepudin", "Nining Kurniasih, S.KM.",
    "Iwan Setiadi, S.P.", "Lukman Hakim", "Ratna Sari Dewi, S.Sos.", "Budi Santoso, S.H.", "Yanti Mulyani", "Dimas Aditya, S.M.",
  ];

  const komisiDef: [string, string, string, string][] = [
    ["Komisi I", "Komisi", "Pemerintahan, Hukum & HAM", "Sekretariat Daerah\nInspektorat\nSatpol PP\nDinas Kependudukan dan Pencatatan Sipil\nBadan Kepegawaian Daerah\nKantor Kesbangpol"],
    ["Komisi II", "Komisi", "Perekonomian & Keuangan", "Badan Pengelola Keuangan Daerah\nDinas Pertanian\nDinas Koperasi dan UMKM\nDinas Perdagangan\nBank Daerah\nBUMD"],
    ["Komisi III", "Komisi", "Pembangunan & Infrastruktur", "Dinas Pekerjaan Umum dan Penataan Ruang\nDinas Perhubungan\nDinas Lingkungan Hidup\nDinas Perumahan dan Kawasan Permukiman\nBappeda"],
    ["Komisi IV", "Komisi", "Kesejahteraan Rakyat", "Dinas Pendidikan\nDinas Kesehatan\nDinas Sosial\nDinas Tenaga Kerja\nDinas Pemuda dan Olahraga\nRSUD"],
    ["Badan Musyawarah", "Badan", "Penjadwalan & Agenda Dewan", ""],
    ["Badan Anggaran", "Badan", "Pembahasan APBD", ""],
    ["Badan Pembentukan Peraturan Daerah", "Badan", "Program Legislasi Daerah", ""],
    ["Badan Kehormatan", "Badan", "Kode Etik & Tata Tertib", ""],
  ];

  const fraksi: Fraksi[] = fraksiDef.map(([nama, singkatan, warna], i) => ({
    ...base(`f${i + 1}`),
    nama,
    slug: slugify(singkatan),
    singkatan,
    logo: "",
    warna,
    ketuaId: "",
    sekretarisId: "",
    deskripsi: `${nama} merupakan pengelompokan anggota DPRD berdasarkan konfigurasi partai politik hasil pemilihan umum. Fraksi berperan mengoordinasikan sikap politik anggotanya dalam setiap pembahasan di DPRD.`,
    urutan: i + 1,
  }));

  const komisi: Komisi[] = komisiDef.map(([nama, jenis, bidang, mitra], i) => ({
    ...base(i < 4 ? `k${i + 1}` : `b${i - 3}`),
    nama,
    slug: slugify(nama),
    jenis,
    bidang,
    deskripsi:
      jenis === "Komisi"
        ? `${nama} membidangi urusan ${bidang.toLowerCase()}. ${nama} melaksanakan fungsi legislasi, anggaran, dan pengawasan bersama mitra kerja di lingkungan pemerintah daerah.`
        : `${nama} merupakan alat kelengkapan DPRD yang bersifat tetap dan bertugas di bidang ${bidang.toLowerCase()}.`,
    mitraKerja: mitra,
    ketuaId: "",
    wakilKetuaId: "",
    sekretarisId: "",
    anggotaIds: [],
    urutan: i + 1,
  }));

  // Sebaran anggota ke fraksi sesuai jumlah kursi
  const fraksiOf: string[] = [];
  fraksiDef.forEach(([, , , seats], i) => {
    for (let s = 0; s < seats; s++) fraksiOf.push(`f${i + 1}`);
  });
  // Acak urutan secara deterministik agar pimpinan berasal dari fraksi berbeda
  const order = [0, 7, 13, 19, 1, 8, 14, 20, 2, 9, 15, 21, 3, 10, 16, 22, 4, 11, 17, 23, 5, 12, 18, 24, 6, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34];
  const jabatanPimpinan = ["Ketua DPRD", "Wakil Ketua DPRD", "Wakil Ketua DPRD", "Wakil Ketua DPRD"];
  const pendidikan = ["S1 Ilmu Pemerintahan", "S2 Manajemen", "S1 Hukum", "S1 Ekonomi", "S1 Teknik Sipil", "S2 Administrasi Publik", "S1 Pendidikan"];
  const kota = ["Ternate", "Tidore", "Sofifi", "Tobelo", "Jailolo", "Manado", "Ambon"];

  let komisiTurn = 0;
  const anggota: Anggota[] = order.map((nameIdx, i) => {
    const nama = names[nameIdx];
    const isPimpinan = i < 4;
    const komisiId = isPimpinan ? "" : `k${(komisiTurn++ % 4) + 1}`;
    return {
      ...base(`a${i + 1}`),
      nama,
      slug: slugify(nama.split(",")[0]),
      foto: "",
      jabatan: isPimpinan ? jabatanPimpinan[i] : "Anggota",
      fraksiId: fraksiOf[nameIdx],
      komisiId,
      dapil: `Dapil ${(i % 5) + 1}`,
      tempatLahir: kota[i % kota.length],
      tanggalLahir: `${1965 + (i % 25)}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 27) + 1).padStart(2, "0")}`,
      pendidikan: pendidikan[i % pendidikan.length],
      email: "",
      bio: `${nama} merupakan anggota DPRD periode ${DEFAULT_SETTINGS.periode} yang terpilih dari Dapil ${(i % 5) + 1}. Aktif memperjuangkan aspirasi masyarakat, khususnya di bidang pembangunan, pendidikan, dan pemberdayaan ekonomi warga.`,
      urutan: i + 1,
    };
  });

  // Pimpinan fraksi & komisi
  for (const f of fraksi) {
    const members = anggota.filter((a) => a.fraksiId === f.id && a.jabatan === "Anggota");
    f.ketuaId = members[0]?.id || "";
    f.sekretarisId = members[1]?.id || "";
  }
  for (const k of komisi.filter((k) => k.jenis === "Komisi")) {
    const members = anggota.filter((a) => a.komisiId === k.id);
    k.ketuaId = members[0]?.id || "";
    k.wakilKetuaId = members[1]?.id || "";
    k.sekretarisId = members[2]?.id || "";
  }
  komisi.filter((k) => k.jenis === "Badan").forEach((k, i) => {
    k.ketuaId = i === 3 ? "a10" : "a1";
    k.wakilKetuaId = i === 3 ? "a11" : "a2";
    k.sekretarisId = "";
    k.anggotaIds = anggota.slice(4 + i * 6, 10 + i * 6).map((a) => a.id);
  });

  // Foto hero: Wikimedia Commons, lisensi Public Domain
  // Foto hero: Wikimedia Commons. Lisensi CC mewajibkan atribusi → kolom "kredit" tampil di pojok hero.
  const slides: Slide[] = [
    ["Panorama Kota Ternate", "Kota Ternate dengan latar Gunung Gamalama — bersama rakyat membangun Kota Ternate.", "ternate-gamalama", "Foto: Fabio Achilli / Wikimedia Commons (CC BY 2.0)"],
    ["Rapat Paripurna", "Saksikan siaran langsung rapat-rapat dewan melalui TV DPRD.", "paripurna", ""],
    ["Gunung Gamalama", "Transparansi produk hukum dan informasi publik DPRD Kota Ternate.", "gunung-gamalama", "Foto: Marwan Mohamad / Wikimedia Commons (CC BY-SA 4.0)"],
  ].map(([judul, subjudul, foto, kredit], i) => ({
    ...base(`s${i + 1}`),
    judul,
    subjudul,
    gambar: `/images/hero/${foto}.jpg`,
    kredit,
    urutan: i + 1,
    aktif: true,
  }));

  const beritaDef: [string, string, string][] = [
    ["DPRD Gelar Rapat Paripurna Penetapan APBD Tahun Anggaran 2027", "Paripurna", "Rapat paripurna menyetujui Rancangan Peraturan Daerah tentang APBD Tahun Anggaran 2027 setelah melalui pembahasan intensif bersama pemerintah daerah."],
    ["Komisi III Tinjau Proyek Perbaikan Jalan dan Jembatan di Wilayah Selatan", "Komisi", "Komisi III melakukan kunjungan lapangan untuk memastikan kualitas dan ketepatan waktu pengerjaan proyek infrastruktur."],
    ["Ketua DPRD Terima Audiensi Aliansi Petani Terkait Ketersediaan Pupuk", "Aspirasi", "Ketua DPRD menerima perwakilan petani yang menyampaikan keluhan kelangkaan pupuk bersubsidi menjelang musim tanam."],
    ["Bapemperda Bahas Raperda Pengelolaan Sampah Berbasis Masyarakat", "Legislasi", "Badan Pembentukan Peraturan Daerah memulai pembahasan raperda inisiatif DPRD tentang pengelolaan sampah."],
    ["Komisi IV Dorong Peningkatan Layanan Kesehatan di Puskesmas", "Komisi", "Komisi IV meminta dinas kesehatan memperkuat tenaga medis dan sarana prasarana puskesmas di daerah terpencil."],
    ["Anggota DPRD Laksanakan Reses Masa Sidang I, Serap Aspirasi Warga", "Reses", "Seluruh anggota DPRD turun ke daerah pemilihan masing-masing untuk menyerap aspirasi masyarakat."],
    ["DPRD Luncurkan Kanal Aspirasi Online dan TV Streaming", "Kelembagaan", "Inovasi layanan digital ini memudahkan masyarakat menyampaikan aspirasi dan mengikuti rapat dewan dari mana saja."],
    ["Badan Kehormatan Sosialisasikan Kode Etik Anggota Dewan", "Kelembagaan", "Sosialisasi kode etik bertujuan menjaga martabat, kehormatan, citra, dan kredibilitas DPRD."],
  ];
  const berita: Berita[] = beritaDef.map(([judul, kategori, ringkasan], i) => ({
    ...base(`n${i + 1}`),
    judul,
    slug: slugify(judul),
    ringkasan,
    konten: `${ringkasan}\n\nKegiatan tersebut dihadiri oleh unsur pimpinan DPRD, para anggota dewan, serta perwakilan pemerintah daerah dan organisasi perangkat daerah terkait. Dalam kesempatan itu, pimpinan rapat menegaskan pentingnya sinergi antara legislatif dan eksekutif dalam mewujudkan pembangunan yang merata.\n\n## Poin-poin Penting\n- Peningkatan kualitas pelayanan publik kepada masyarakat.\n- Penguatan fungsi pengawasan terhadap program pemerintah daerah.\n- Tindak lanjut aspirasi masyarakat yang telah dihimpun sebelumnya.\n\n> "DPRD akan terus mengawal setiap kebijakan agar benar-benar berpihak kepada kepentingan rakyat," ujar pimpinan rapat.\n\nKe depan, DPRD berkomitmen untuk terus membuka ruang partisipasi publik seluas-luasnya, baik melalui forum rapat dengar pendapat, kegiatan reses, maupun kanal aspirasi online yang tersedia di portal resmi ini.`,
    gambar: img(`dprd-news-${i + 1}`),
    kategori,
    penulis: "Humas Sekretariat DPRD",
    tanggal: day(-i * 3 - 1),
    unggulan: i < 2,
    publish: true,
  }));

  const agendaDef: [string, string, number, string, string, string, string, boolean][] = [
    ["Rapat Paripurna Penyampaian Nota Keuangan Raperda APBD", "Rapat Paripurna", 2, "09.00", "12.00", "Ruang Rapat Paripurna", "", true],
    ["Rapat Dengar Pendapat dengan Dinas Pendidikan", "Rapat Dengar Pendapat", 3, "10.00", "13.00", "Ruang Rapat Komisi IV", "k4", false],
    ["Kunjungan Kerja Pengawasan Proyek Drainase Kota", "Kunjungan Kerja", 5, "08.00", "15.00", "Kecamatan Ternate Utara", "k3", false],
    ["Rapat Badan Anggaran Pembahasan KUA-PPAS", "Rapat Badan", 7, "13.00", "17.00", "Ruang Rapat Badan Anggaran", "b2", true],
    ["Rapat Kerja Komisi II dengan BUMD", "Rapat Kerja", 9, "09.30", "12.00", "Ruang Rapat Komisi II", "k2", false],
    ["Reses Masa Sidang II Tahun 2026", "Reses", 14, "08.00", "16.00", "Daerah Pemilihan Masing-masing", "", false],
    ["Rapat Paripurna Pengesahan Raperda Pengelolaan Sampah", "Rapat Paripurna", 18, "09.00", "11.30", "Ruang Rapat Paripurna", "", true],
    ["Rapat Komisi I Evaluasi Pelayanan Administrasi Kependudukan", "Rapat Komisi", -2, "10.00", "12.00", "Ruang Rapat Komisi I", "k1", false],
    ["Rapat Paripurna Pandangan Umum Fraksi", "Rapat Paripurna", -5, "09.00", "12.00", "Ruang Rapat Paripurna", "", true],
    ["Audiensi Forum Guru Honorer", "Audiensi", -8, "13.00", "15.00", "Ruang Rapat Pimpinan", "k4", false],
  ];
  const agenda: Agenda[] = agendaDef.map(([judul, jenis, offset, waktuMulai, waktuSelesai, lokasi, komisiId, disiarkan], i) => ({
    ...base(`g${i + 1}`),
    judul,
    jenis,
    tanggal: day(offset),
    waktuMulai,
    waktuSelesai,
    lokasi,
    komisiId,
    status: offset < 0 ? "Selesai" : "Terjadwal",
    deskripsi: `Agenda ${jenis.toLowerCase()} DPRD dengan pokok bahasan: ${judul}. Kegiatan ini terbuka untuk umum sesuai ketentuan tata tertib DPRD.`,
    disiarkan,
  }));

  const videos: Video[] = [
    ["Rapat Paripurna Pengesahan APBD 2027", "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", "Paripurna"],
    ["Dialog Wakil Rakyat: Pupuk Bersubsidi untuk Petani", "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", "Dialog"],
    ["RDP Komisi IV Bersama Dinas Kesehatan", "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", "Rapat Komisi"],
    ["Liputan Reses Masa Sidang I", "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", "Liputan"],
    ["Pekan Legislasi: Raperda Pengelolaan Sampah", "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", "Legislasi"],
    ["Profil DPRD Periode 2024–2029", "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", "Profil"],
  ].map(([judul, url, kategori], i) => ({
    ...base(`v${i + 1}`),
    judul,
    url,
    thumbnail: img(`dprd-video-${i + 1}`, 960, 540),
    kategori,
    tanggal: day(-i * 4 - 2),
    deskripsi: `Rekaman ${kategori.toLowerCase()} DPRD: ${judul}.`,
  }));

  const dokumenDef: [string, string, string, string][] = [
    ["Peraturan Daerah tentang Anggaran Pendapatan dan Belanja Daerah Tahun Anggaran 2026", "Peraturan Daerah", "1", "2026"],
    ["Peraturan Daerah tentang Penyelenggaraan Ketertiban Umum", "Peraturan Daerah", "2", "2026"],
    ["Peraturan Daerah tentang Rencana Pembangunan Jangka Menengah Daerah", "Peraturan Daerah", "5", "2025"],
    ["Rancangan Peraturan Daerah tentang Pengelolaan Sampah Berbasis Masyarakat", "Rancangan Perda", "-", "2026"],
    ["Keputusan DPRD tentang Program Pembentukan Peraturan Daerah Tahun 2027", "Keputusan DPRD", "12", "2026"],
    ["Keputusan DPRD tentang Tata Tertib DPRD", "Keputusan DPRD", "1", "2024"],
    ["Laporan Kinerja DPRD Tahun 2025", "Laporan", "-", "2025"],
    ["Rencana Kerja DPRD Tahun 2026", "Laporan", "-", "2026"],
  ];
  const dokumen: Dokumen[] = dokumenDef.map(([judul, jenis, nomor, tahun], i) => ({
    ...base(`d${i + 1}`),
    judul,
    jenis,
    nomor,
    tahun,
    tanggal: day(-i * 20 - 10),
    file: "",
    deskripsi: "",
  }));

  const galeri: Galeri[] = Array.from({ length: 9 }, (_, i) => ({
    ...base(`p${i + 1}`),
    judul: ["Rapat Paripurna", "Kunjungan Kerja Komisi III", "Reses Anggota Dewan", "Audiensi Masyarakat", "Rapat Badan Anggaran", "Peringatan Hari Jadi Daerah", "Sosialisasi Perda", "Rapat Dengar Pendapat", "Bimbingan Teknis Anggota"][i],
    gambar: img(`dprd-gallery-${i + 1}`, 1000, 750),
    keterangan: "Dokumentasi kegiatan DPRD.",
    tanggal: day(-i * 5),
  }));

  const aspirasi: Aspirasi[] = [
    ["Perbaikan jalan rusak di Desa Mekarsari", "Infrastruktur", "k3", "Ditindaklanjuti", "Aspirasi telah diteruskan kepada Dinas PUPR dan masuk dalam rencana perbaikan triwulan berikutnya. Komisi III akan memantau pelaksanaannya.", true, false],
    ["Kekurangan guru di salah satu SD Negeri di Ternate Selatan", "Pendidikan", "k4", "Selesai", "Komisi IV telah melakukan rapat dengan Dinas Pendidikan. Penambahan dua guru telah direalisasikan pada semester ini.", true, false],
    ["Penerangan jalan umum di lingkungan RW 05", "Infrastruktur", "k3", "Diproses", "", false, true],
    ["Bantuan modal usaha untuk UMKM", "Ekonomi", "k2", "Baru", "", false, false],
  ].map(([judul, kategori, komisiId, status, tanggapan, tampilPublik, anonim], i) => ({
    ...base(`r${i + 1}`),
    kode: `ASP-${day(-i * 6).replace(/-/g, "").slice(2)}-${["7KQ2", "M4XA", "P9DT", "Z3HN"][i]}`,
    nama: ["Ujang Supriatna", "Euis Komalasari", "Warga RW 05", "Tono Wijaya"][i],
    email: "",
    telepon: "",
    alamat: "",
    kategori: kategori as string,
    komisiId: komisiId as string,
    judul: judul as string,
    isi: `Dengan hormat, kami menyampaikan aspirasi terkait ${String(judul).toLowerCase()}. Kondisi ini sudah berlangsung cukup lama dan sangat mengganggu aktivitas masyarakat. Kami berharap DPRD dapat menindaklanjuti hal ini bersama pemerintah daerah.`,
    lampiran: "",
    status: status as string,
    tanggapan: tanggapan as string,
    tampilPublik: tampilPublik as boolean,
    anonim: anonim as boolean,
    createdAt: new Date(now.getTime() - i * 6 * 864e5).toISOString(),
  }));

  return {
    settings: DEFAULT_SETTINGS,
    slides,
    berita,
    agenda,
    anggota,
    fraksi,
    komisi,
    videos,
    aspirasi,
    dokumen,
    galeri,
    users: [{ ...base("u1"), username: "admin", nama: "Administrator", role: "admin", passwordHash: hashPassword("admin123") }],
  };
}
