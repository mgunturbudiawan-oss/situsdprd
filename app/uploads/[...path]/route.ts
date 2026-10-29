import fs from "fs";
import path from "path";
import { get } from "@vercel/blob";
import { MIME, UPLOAD_DIR, usingBlob } from "@/lib/upload";

const headersFor = (ext: string) => ({
  "Content-Type": MIME[ext] || "application/octet-stream",
  "Cache-Control": "public, max-age=31536000, immutable",
  "X-Content-Type-Options": "nosniff",
});

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const parts = (await params).path;
  const ext = path.extname(parts[parts.length - 1] || "").slice(1).toLowerCase();

  // Store Vercel Blob private: baca dengan token lalu teruskan ke pengunjung.
  if (usingBlob() && !parts.some((p) => p === ".." || p === "." || p.includes("\\"))) {
    const res = await get(`uploads/${parts.join("/")}`, { access: "private" }).catch(() => null);
    if (res?.statusCode === 200) return new Response(res.stream, { headers: headersFor(ext) });
  }

  const file = path.resolve(UPLOAD_DIR, ...parts);
  if (!file.startsWith(UPLOAD_DIR + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    return new Response("Not found", { status: 404 });
  }
  return new Response(fs.readFileSync(file), { headers: headersFor(ext) });
}
