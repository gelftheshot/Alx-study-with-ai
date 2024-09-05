import { NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const runtime = 'edge';
export const maxDuration = 300;

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');
  const count = parseInt(formData.get('count'));
  const difficulty = parseInt(formData.get('difficulty'));

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const fileContent = await file.text();

  const systemPrompt = `Generate ${count} flashcards based on the given PDF content with a difficulty of ${difficulty}% (1% easiest, 100% hardest).

Instructions:
1. Each flashcard should focus on a key concept within the content.
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
    const result = await generateText({
      model: google('models/gemini-1.5-pro-latest'),
      system: systemPrompt,
      prompt: fileContent,
    });

    let flashcards = JSON.parse(result.text);

    if (!Array.isArray(flashcards) || flashcards.length !== count) {
      throw new Error('Invalid flashcard format or count');
    }

    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
