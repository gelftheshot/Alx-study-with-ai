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

  const systemPrompt = `Generate ${count} flashcards based ONLY on the provided text content with a difficulty of ${difficulty}% (1% easiest, 100% hardest).

  Instructions:
  1. Use ONLY the information from the text content provided. Do not use any external knowledge.
  2. Each flashcard must be about a specific fact or concept from the text.
  3. The front should have a clear, thought-provoking question based on the content.
  4. The back should provide a concise, accurate answer derived from the text.
  5. Include a 'detail' field for additional information or context from the text.
  6. Set the 'strength' value to match the specified difficulty level.
  7. Your entire response must be a valid JSON array that can be parsed directly.
  8. Do not include ANY text outside of the JSON structure.

  Your response MUST be EXACTLY in this JSON format, with ${count} flashcards:
  [
    {
      "front": "Question from text content?",
      "back": "Answer based on the text content",
      "detail": "Additional explanation or context from the text",
      "strength": "${difficulty}"
    }
  ]

  Generate exactly ${count} flashcards. Do not add any explanations, comments, or additional text.`;

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

    // Ensure we have the correct number of flashcards
    if (Array.isArray(flashcards)) {
      flashcards = flashcards.slice(0, parseInt(count));
    } else {
      throw new Error('Invalid flashcard format: expected an array');
    }

    if (flashcards.length !== parseInt(count)) {
      console.warn(`Warning: Generated ${flashcards.length} flashcards instead of ${count}`);
    }

    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
