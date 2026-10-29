"use client";

/** Dipakai bila layout utama gagal (mis. database tidak dapat dihubungi). Gaya ditulis inline karena CSS situs belum termuat. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#042440", color: "#fff" }}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
          <h1 style={{ fontSize: 28, margin: 0 }}>Situs sedang mengalami gangguan</h1>
          <p style={{ maxWidth: 440, opacity: 0.8, lineHeight: 1.6 }}>
            Kami tidak dapat memuat halaman saat ini. Silakan coba lagi beberapa saat lagi.
          </p>
          {error.digest && <p style={{ fontFamily: "monospace", fontSize: 12, opacity: 0.5 }}>Kode: {error.digest}</p>}
          <button
            onClick={reset}
            style={{ marginTop: 16, padding: "10px 24px", borderRadius: 8, border: 0, background: "#f2b705", color: "#042440", fontWeight: 700, cursor: "pointer" }}
          >
            Coba Lagi
          </button>
        </div>
      </body>
    </html>
  );
}
