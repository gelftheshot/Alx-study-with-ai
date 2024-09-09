import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const maxDuration = 300;

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const YOUR_SITE_URL = process.env.YOUR_SITE_URL || 'http://localhost:3000';
const YOUR_SITE_NAME = process.env.YOUR_SITE_NAME || 'FlashcardsWithAI';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function fetchWithRetry(url, options, retries = MAX_RETRIES) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying... Attempts left: ${retries - 1}`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

export async function POST(req) {
  const { text, count, difficulty } = await req.json();

  if (!text) {
    return NextResponse.json({ error: 'No text provided' }, { status: 400 });
  }

  const systemPrompt = `Generate ${count} multiple choice questions based on the given text content with a difficulty of ${difficulty}% (1% easiest, 100% hardest).

  Instructions:
  1. Focus solely on the text content provided, ignoring any PDF-specific information.
  2. Each question should be about a key point or fact from the text.
  3. Provide four options (A, B, C, D) for each question, with only one correct answer.
  4. Ensure the correct answer is clearly indicated.
  5. Match the specified difficulty level in terms of content complexity.
  6. Do not include any text outside of the JSON structure.
  7. Ensure the response is valid JSON and can be parsed directly.

  Format your response ONLY as a JSON array of objects with this structure:
  [
    {
      "question": "Content-based question here?",
      "A": "Option A text",
      "B": "Option B text",
      "C": "Option C text",
      "D": "Option D text",
      "correctAnswer": "A"
    }
  ]

  Generate exactly ${count} questions in this format. Do not include any other text or explanations.`;

  try {
    const response = await fetchWithRetry("https://openrouter.ai/api/v1/chat/completions", {
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

    const result = await response.json();
    console.log('Raw API response:', JSON.stringify(result));

    if (!result.choices || !result.choices[0] || !result.choices[0].message || !result.choices[0].message.content) {
      throw new Error('Unexpected API response structure');
    }

    const content = result.choices[0].message.content;
    console.log('Content from API:', content);

    let questions;
    try {
      questions = JSON.parse(content);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      console.log('Raw content:', content);
      throw new Error('Failed to parse API response as JSON');
    }

    if (!Array.isArray(questions) || questions.length !== parseInt(count)) {
      console.error('Invalid questions structure:', questions);
      throw new Error(`Invalid question format or count: expected ${count}, got ${questions?.length}`);
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error generating multiple choice questions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


