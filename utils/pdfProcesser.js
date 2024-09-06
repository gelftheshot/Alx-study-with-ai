import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

async function PdfToChunk(file, maxTokens = 8000) {
    const loader = new PDFLoader(file);
    const doc = await loader.load();

    const textsplitter = new RecursiveCharacterTextSplitter({
        chunkSize: maxTokens * 4, // Approximate 4 characters per token
        chunkOverlap: 200,
    });
    const splitedtext = await textsplitter.splitDocuments(doc);

    // Combine all chunks into a single string
    let fullText = splitedtext.map(chunk => chunk.pageContent).join(' ');

    // Trim the text to the approximate token limit
    if (fullText.length > maxTokens * 4) {
        fullText = fullText.slice(0, maxTokens * 4);
    }

    console.log("Extracted PDF content (truncated):", fullText.slice(0, 200) + "...");
    return fullText;
}

export default PdfToChunk;
