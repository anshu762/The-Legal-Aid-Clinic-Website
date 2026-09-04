import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Instead of saving to disk (which fails on Vercel), convert to Base64 Data URI
    let mimeType = file.type || "application/octet-stream";
    const ext = path.extname(file.name).toLowerCase();
    if (ext === ".pdf") mimeType = "application/pdf";
    if (ext === ".jpg" || ext === ".jpeg") mimeType = "image/jpeg";
    if (ext === ".png") mimeType = "image/png";

    const base64Data = buffer.toString("base64");
    const dataUri = `data:${mimeType};base64,${base64Data}`;

    // Return the Data URI directly as the "filename" so frontend stores it in DB
    return NextResponse.json({ filename: dataUri });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
