import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const maxDuration = 300;

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const YOUR_SITE_URL = process.env.YOUR_SITE_URL || 'http://localhost:3000';
const YOUR_SITE_NAME = process.env.YOUR_SITE_NAME || 'NotesWithAI';

export async function POST(req) {
  const { text, wordCount, complexity } = await req.json();

  if (!text) {
    return NextResponse.json({ error: 'No text provided' }, { status: 400 });
  }

  const systemPrompt = `Generate a comprehensive note based ONLY on the provided text content with approximately ${wordCount} words and a complexity level of ${complexity}% (1% simplest, 100% most complex).

  Instructions:
  1. Use ONLY the information from the text content provided. Do not use any external knowledge.
  2. The note should summarize key points and concepts from the text.
  3. Organize the note in a clear, logical structure.
  4. Adjust the language complexity to match the specified level.
  5. Your response must be a valid JSON object that can be parsed directly.
  6. Do not include ANY text outside of the JSON structure.

  Your response MUST be EXACTLY in this JSON format:
  {
    "content": "The generated note content goes here..."
  }

  Generate the note with approximately ${wordCount} words. Do not add any explanations, comments, or additional text outside the JSON structure.`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": YOUR_SITE_URL,
        "X-Title": YOUR_SITE_NAME,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "meta-llama/llama-3.1-8b-instruct:free",
        "messages": [
          {"role": "system", "content": systemPrompt},
          {"role": "user", "content": text},
        ],
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API request failed with status ${response.status}`);
    }

    const result = await response.json();
    let note;

    try {
      const content = result.choices[0].message.content;
      console.log('Raw API response:', content);
      note = JSON.parse(content);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      throw new Error('Failed to parse API response');
    }

    if (!note || !note.content) {
      throw new Error('Invalid note format: expected an object with a content property');
    }

    return NextResponse.json({ note });
  } catch (error) {
    console.error('Error generating note:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}