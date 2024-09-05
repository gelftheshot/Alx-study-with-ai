import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const maxDuration = 300;

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const YOUR_SITE_URL = process.env.YOUR_SITE_URL || 'http://localhost:3000';
const YOUR_SITE_NAME = process.env.YOUR_SITE_NAME || 'FlashcardsWithAI';

export async function POST(req) {
  const { prompt, count, difficulty } = await req.json();
  const systemPrompt = `Generate ${count} flashcards on the given topic with a difficulty of ${difficulty}% (1% easiest, 100% hardest).

Instructions:
1. Each flashcard should focus on a key concept within the topic.
2. The front should have a clear, thought-provoking question.
3. The back should provide a concise, accurate answer.
4. Include a 'detail' field for additional information or context.
5. Set the 'strength' value to match the specified difficulty level.
6. Do not include any text outside of the JSON structure.
7. Ensure the response is valid JSON and can be parsed directly.

Format your response ONLY as a JSON array of objects with this structure:
[
  {
    "front": "Question on the front of the flashcard?",
    "back": "Answer on the back of the flashcard",
    "detail": "Additional explanation or context",
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
          {"role": "user", "content": prompt},
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

    if (!Array.isArray(flashcards)) {
      console.error('Parsed content is not an array:', flashcards);
      throw new Error('Invalid flashcard structure: not an array');
    }

    if (flashcards.length !== count) {
      console.error(`Expected ${count} flashcards, but got ${flashcards.length}`);
      throw new Error(`Invalid number of flashcards: expected ${count}, got ${flashcards.length}`);
    }

    const invalidCards = flashcards.filter(card => !card.front || !card.back || !card.detail || !card.strength);
    if (invalidCards.length > 0) {
      console.error('Invalid flashcards:', invalidCards);
      throw new Error(`Invalid flashcard structure: ${invalidCards.length} cards are missing required fields`);
    }

    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return NextResponse.json({ 
      error: error.message,
      details: error.stack,
      rawResponse: result?.choices?.[0]?.message?.content || 'No raw response available'
    }, { status: 500 });
  }
}