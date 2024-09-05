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

  const systemPrompt = `You are an expert multiple choice question generator. Given the content of a PDF file, create a concise list of exactly ${count} multiple choice questions with a difficulty level of ${difficulty}% (1% being easiest, 100% being hardest). Each question should:
   1. Focus on a key concept within the content.
   2. Have a clear, unambiguous question.
   3. Provide four answer options (A, B, C, D), with only one correct answer.
   4. Be suitable for effective learning and assessment.
   5. Match the specified difficulty level.

   Return exactly ${count} questions as a JSON array of objects, each with 'question', 'correctAnswer', 'A', 'B', 'C', and 'D' properties as strings.
   Example format: [{"question": "What is the capital of France?", "correctAnswer": "C", "A": "London", "B": "Berlin", "C": "Paris", "D": "Madrid"}]`;

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
