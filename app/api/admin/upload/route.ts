import { getCurrentUser } from "@/lib/auth";
import { saveUpload } from "@/lib/upload";

/** Unggah gambar dari editor visual CMS. Hanya untuk pengguna yang sudah login. */
export async function POST(req: Request) {
  if (!(await getCurrentUser())) return Response.json({ error: "Tidak diizinkan" }, { status: 401 });
  const file = (await req.formData()).get("file");
  if (!(file instanceof File) || file.size === 0) return Response.json({ error: "File tidak ditemukan" }, { status: 400 });
  try {
    return Response.json({ url: await saveUpload(file, "image") });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
