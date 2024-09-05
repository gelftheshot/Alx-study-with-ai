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

  const systemPrompt = `Generate ${count} multiple-choice questions based on the given PDF content with a difficulty of ${difficulty}% (1% easiest, 100% hardest).

Instructions:
1. Each question should focus on a key concept within the content.
2. Provide four options (A, B, C, D) for each question.
3. Ensure only one option is correct.
4. Match the specified difficulty level.
5. Do not include any text outside of the JSON structure.
6. Ensure the response is valid JSON and can be parsed directly.

Format your response ONLY as a JSON array of objects with this structure:
[
  {
    "question": "Question text here?",
    "correctAnswer": "A",
    "A": "Option A text",
    "B": "Option B text",
    "C": "Option C text",
    "D": "Option D text"
  }
]

Generate exactly ${count} questions in this format. Do not include any other text or explanations.`;

  try {
    const result = await generateText({
      model: google('models/gemini-1.5-pro-latest'),
      system: systemPrompt,
      prompt: fileContent,
    });

    let questions = JSON.parse(result.text);

    if (!Array.isArray(questions) || questions.length !== count) {
      throw new Error('Invalid question format or count');
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error generating multiple-choice questions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
