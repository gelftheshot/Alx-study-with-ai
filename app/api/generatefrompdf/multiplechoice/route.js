import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const maxDuration = 300;

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const YOUR_SITE_URL = process.env.YOUR_SITE_URL || 'http://localhost:3000';
const YOUR_SITE_NAME = process.env.YOUR_SITE_NAME || 'FlashcardsWithAI';

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');
  const count = parseInt(formData.get('count'));
  const difficulty = parseInt(formData.get('difficulty'));

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const fileContent = await file.text();

  const systemPrompt = `Generate ${count} multiple-choice questions based on the given text content with a difficulty of ${difficulty}% (1% easiest, 100% hardest).

Instructions:
1. Focus solely on the text content provided, ignoring any PDF-specific information.
2. Each question should be about a key concept or fact from the text.
3. Provide four options (A, B, C, D) for each question, all based on the content.
4. Ensure only one option is correct.
5. Match the specified difficulty level in terms of content complexity.
6. Do not include any text outside of the JSON structure.
7. Ensure the response is valid JSON and can be parsed directly.

Format your response ONLY as a JSON array of objects with this structure:
[
  {
    "question": "Content-based question here?",
    "correctAnswer": "A",
    "A": "Option A text",
    "B": "Option B text",
    "C": "Option C text",
    "D": "Option D text"
  }
]

Generate exactly ${count} questions in this format. Do not include any other text or explanations.`;

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
          {"role": "user", "content": fileContent},
        ],
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API request failed with status ${response.status}`);
    }

    const result = await response.json();
    const questions = JSON.parse(result.choices[0].message.content);

    if (!Array.isArray(questions) || questions.length !== count) {
      throw new Error('Invalid question format or count');
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error generating multiple choice questions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
