import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(req) {
  const { prompt } = await req.json();
  const systemPrompt = `You are a flashcard generator. You are given a topic and you need to generate a list of flashcards on the topic. To generate a flashcard, you need to follow these steps: 
  1. Research the topic to gather relevant information.
  2. Identify key concepts and break them down into smaller chunks.
  3. Create a question for each chunk that will prompt the user to recall the information.
  4. Write a concise answer to each question.
  5. Store each question-answer pair as a separate flashcard.
  6. Return the list of flashcards in JSON format, with each flashcard represented as an object containing 'front' and 'back' properties as strings.`;

  const result = await generateText({
    model: google('models/gemini-1.5-pro-latest'),
    system: systemPrompt,
    prompt,
  });
  return result;
}