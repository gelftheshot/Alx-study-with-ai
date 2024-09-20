import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const maxDuration = 300;

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const YOUR_SITE_URL = process.env.YOUR_SITE_URL || 'http://localhost:3000';
const YOUR_SITE_NAME = process.env.YOUR_SITE_NAME || 'AskAIWithALX';

export async function POST(req) {
  const { message } = await req.json();

  if (!message) {
    return NextResponse.json({ error: 'No message provided' }, { status: 400 });
  }

  const systemPrompt = `You are a helpful AI assistant. Provide clear, concise, and accurate answers to the user's questions. If you're unsure about something, admit it and suggest where the user might find more information.`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      throw new Error('Request timed out');
    }, 120000); // 120 seconds timeout

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
          {"role": "user", "content": message},
        ],
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Error asking AI:', error);
    if (error.name === 'AbortError' || error.message === 'Request timed out') {
      return NextResponse.json({ error: 'The request timed out. Please try again.' }, { status: 504 });
    }
    return NextResponse.json({ error: 'An error occurred while processing your request. Please try again.' }, { status: 500 });
  }
}