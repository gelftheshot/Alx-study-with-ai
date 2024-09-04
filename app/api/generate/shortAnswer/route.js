import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const runtime = 'edge';
export const maxDuration = 300; // Set timeout to 5 minutes (300 seconds)

export async function POST(req) {
  const { prompt, count, difficulty } = await req.json();
  const systemPrompt = `You are an expert short answer question generator. Given a topic, create a concise list of exactly ${count} short answer questions with a difficulty level of ${difficulty}% (1% being easiest, 100% being hardest). Each question should:
   1. Focus on a key concept within the topic.
   2. Have a clear, specific question that requires a brief response.
   3. Provide a concise, accurate answer.
   4. Be suitable for effective learning and assessment.
   5. Match the specified difficulty level.

   Return exactly ${count} questions as a JSON array of objects, each with 'question' and 'answer' properties as strings.
   Example format: [{"question": "What is the capital of France?", "answer": "Paris"}]`;

  try {
    const result = await Promise.race([
      generateText({
        model: google('models/gemini-1.5-pro-latest'),
        system: systemPrompt,
        prompt,
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), 280000)) // 280 seconds timeout
    ]);

    let questions;
    if (result && typeof result === 'object' && 'text' in result) {
      questions = JSON.parse(result.text);
    } else if (typeof result === 'string') {
      questions = JSON.parse(result);
    } else {
      throw new Error('Unexpected result format');
    }

    if (!Array.isArray(questions) || !questions.every(q => q.question && q.answer)) {
      throw new Error('Invalid question structure');
    }

    return Response.json({ questions });
  } catch (error) {
    console.error('Error generating short answer questions:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
