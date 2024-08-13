import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(req) {
  const { prompt } = await req.json();
  const systemPrompt = `You are an expert flashcard generator. Given a topic, create a concise list of flashcards. Each flashcard should:
  1. Focus on a key concept within the topic.
  2. Have a clear, thought-provoking question on the front.
  3. Provide a brief, accurate answer on the back.
  4. Be suitable for effective learning and recall.

  Return the flashcards as a JSON array of objects, each with 'front' and 'back' properties as strings.
  Example format: [{"front": "Question 1?", "back": "Answer 1"}, {"front": "Question 2?", "back": "Answer 2"}]`;

  const result = await generateText({
    model: google('models/gemini-1.5-pro-latest'),
    system: systemPrompt,
    prompt,
  });

  // Parse the result and ensure it's in the correct format
  let flashcards;
  try {
    flashcards = JSON.parse(result);
  } catch (error) {
    console.error('Failed to parse result as JSON:', error);
    return Response.json({ error: 'Failed to generate valid flashcards' }, { status: 500 });
  }

  // Return the flashcards in the correct JSON format
  return Response.json({ flashcards });
}