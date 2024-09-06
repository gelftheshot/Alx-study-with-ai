import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

async function PdfToChunk(file) {
    const loader = new PDFLoader(file);
    const doc = await loader.load();

    const textsplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 5000,
        chunkOverlap: 100,
    });
    const splitedtext = await textsplitter.splitDocuments(doc);

    const chunks = {};
    splitedtext.forEach((chunk, index) => {
        chunks[`chunk${index + 1}`] = chunk.pageContent;
    });

    console.log("Extracted PDF content:", chunks.chunk1);
    return chunks;
}

export default PdfToChunk;
