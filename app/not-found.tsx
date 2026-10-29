import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-primary-950 px-4 text-center text-white">
      <p className="font-display text-8xl font-extrabold text-accent-400">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold">Halaman tidak ditemukan</h1>
      <p className="mt-2 text-white/70">Halaman yang Anda cari mungkin telah dipindahkan atau dihapus.</p>
      <Link href="/" className="btn-accent mt-8">Kembali ke Beranda</Link>
    </div>
  );
}
