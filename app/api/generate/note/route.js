import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const maxDuration = 300;

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const YOUR_SITE_URL = process.env.YOUR_SITE_URL || 'http://localhost:3000';
const YOUR_SITE_NAME = process.env.YOUR_SITE_NAME || 'NotesWithAI';

export async function POST(req) {
  const { prompt, wordCount, complexity } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });
  }

  const systemPrompt = `Generate a comprehensive note on the topic "${prompt}" with approximately ${wordCount} words and a complexity level of ${complexity}% (1% simplest, 100% most complex).

  Instructions:
  1. The note should cover key points and concepts related to the topic.
  2. Organize the note in a clear, logical structure.
  3. Adjust the language complexity to match the specified level.
  4. Return the note as plain text without any JSON formatting.

  Generate the note with approximately ${wordCount} words.`;

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
          {"role": "user", "content": prompt},
        ],
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API request failed with status ${response.status}`);
    }

    const result = await response.json();
    const content = result.choices[0].message.content;
    console.log('Raw API response:', content);

    // Create a note object with the content
    const note = { content: content.trim() };

    return NextResponse.json({ note });
  } catch (error) {
    console.error('Error generating note:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}