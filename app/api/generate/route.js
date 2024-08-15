import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(req) {
  const { prompt, count } = await req.json();
  const systemPrompt = `You are an expert flashcard generator. Given a topic, create a concise list of ${count} flashcards. Each flashcard should:
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

  let flashcards;
  try {
    // Check if result is a DefaultGenerateTextResult object
    if (result && typeof result === 'object' && 'text' in result) {
      // Parse the text property which contains the JSON string
      flashcards = JSON.parse(result.text);
    } else if (typeof result === 'string') {
      // If it's a string, try to parse it as JSON
      flashcards = JSON.parse(result);
    } else {
      throw new Error('Unexpected result format');
    }
  } catch (error) {
    console.error('Failed to parse result:', error);
    console.log('Raw result:', result);
    return Response.json({ error: 'Failed to generate valid flashcards' }, { status: 500 });
  }

  // Validate the structure of the flashcards
  if (!Array.isArray(flashcards) || !flashcards.every(card => card.front && card.back)) {
    console.error('Invalid flashcard structure:', flashcards);
    return Response.json({ error: 'Generated flashcards have an invalid structure' }, { status: 500 });
  }

  // Return the flashcards in the correct JSON format
  return Response.json({ flashcards });
}