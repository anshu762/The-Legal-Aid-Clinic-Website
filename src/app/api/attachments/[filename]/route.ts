import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filename } = await params;
  // Basic path traversal prevention
  if (filename.includes("..") || filename.includes("/")) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const filepath = path.join(process.cwd(), "uploads", "attachments", filename);

  if (!fs.existsSync(filepath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const stat = fs.statSync(filepath);
  // @ts-ignore - using readable stream
  const stream = fs.createReadStream(filepath) as any;

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": stat.size.toString(),
      "Content-Disposition": `inline; filename="${filename}"`
    }
  });
}
