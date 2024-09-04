import mammoth from 'mammoth';

export async function extractTextFromFile(file) {
  const fileType = file.type;
  let text = '';

  if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    text = result.value;
  } else {
    throw new Error('Unsupported file type');
  }

  return text;
}
