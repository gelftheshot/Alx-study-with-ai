import { NextResponse } from 'next/server';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { writeFile } from 'fs/promises';
import path from 'path';
import os from 'os';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  try {
    // Save the file temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempFilePath = path.join(os.tmpdir(), file.name);
    await writeFile(tempFilePath, buffer);

    // Process the PDF
    const loader = new PDFLoader(tempFilePath);
    const docs = await loader.load();
    const text = docs.map(doc => doc.pageContent).join(' ');

    // Trim the text to approximately 8000 tokens (about 32000 characters)
    const trimmedText = text.slice(0, 32000);

    return NextResponse.json({ text: trimmedText });
  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json({ error: 'Error processing PDF' }, { status: 500 });
  }
}
