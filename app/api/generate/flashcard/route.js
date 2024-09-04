import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const runtime = 'edge';
export const maxDuration = 300; // Set timeout to 5 minutes (300 seconds)

export async function POST(req) {
  const { prompt, count } = await req.json();
  const systemPrompt = `You are an expert flashcard generator. Given a topic, create a concise list of exactly ${count} flashcards. Each flashcard should:
   1. Focus on a key concept within the topic.
   2. Have a clear, thought-provoking question on the front.
   3. Provide a detailed, accurate answer on the back, including explanations and examples where appropriate.
   4. Be suitable for effective learning and recall.
   5. Include a strength value between 1 and 100, indicating the importance or difficulty of the question.

   Return exactly ${count} flashcards as a JSON array of objects, each with 'front', 'back', 'detail', and 'strength' properties as strings.
   Example format: [{"front": "Question 1?", "back": "Answer 1", "detail": "Detailed explanation 1", "strength": "75"}, {"front": "Question 2?", "back": "Answer 2", "detail": "Detailed explanation 2", "strength": "60"}]`;

  try {
    const result = await Promise.race([
      generateText({
        model: google('models/gemini-1.5-pro-latest'),
        system: systemPrompt,
        prompt,
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), 280000)) // 280 seconds timeout
    ]);

    let flashcards;
    if (result && typeof result === 'object' && 'text' in result) {
      flashcards = JSON.parse(result.text);
    } else if (typeof result === 'string') {
      flashcards = JSON.parse(result);
    } else {
      throw new Error('Unexpected result format');
    }

    if (!Array.isArray(flashcards) || !flashcards.every(card => card.front && card.back && card.detail && card.strength)) {
      throw new Error('Invalid flashcard structure');
    }

    return Response.json({ flashcards });
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}