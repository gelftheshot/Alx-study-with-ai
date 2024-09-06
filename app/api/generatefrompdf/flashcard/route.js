import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const maxDuration = 300;

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const YOUR_SITE_URL = process.env.YOUR_SITE_URL || 'http://localhost:3000';
const YOUR_SITE_NAME = process.env.YOUR_SITE_NAME || 'FlashcardsWithAI';

export async function POST(req) {
  const { text, count, difficulty } = await req.json();

  if (!text) {
    return NextResponse.json({ error: 'No text provided' }, { status: 400 });
  }

  const systemPrompt = `Generate ${count} flashcards based on the given text content with a difficulty of ${difficulty}% (1% easiest, 100% hardest).

  Instructions:
  1. Focus solely on the text content provided, ignoring any PDF-specific information.
  2. Each flashcard should be about a key concept or fact from the text.
  3. The front should have a clear, thought-provoking question based on the content.
  4. The back should provide a concise, accurate answer derived from the text.
  5. Include a 'detail' field for additional information or context from the text.
  6. Set the 'strength' value to match the specified difficulty level.
  7. Do not include any text outside of the JSON structure.
  8. Ensure the response is valid JSON and can be parsed directly.

  Format your response ONLY as a JSON array of objects with this structure:
  [
    {
      "front": "Question based on the text content?",
      "back": "Answer based on the text content",
      "detail": "Additional explanation or context from the text",
      "strength": "${difficulty}"
    }
  ]

  Generate exactly ${count} flashcards in this format. Do not include any other text or explanations.`;

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
    let flashcards;

    try {
      const content = result.choices[0].message.content;
      console.log('Raw API response:', content);
      flashcards = JSON.parse(content);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      throw new Error('Failed to parse API response');
    }

    if (!Array.isArray(flashcards) || flashcards.length !== count) {
      throw new Error(`Invalid flashcard format or count: expected ${count}, got ${flashcards?.length}`);
    }

    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
