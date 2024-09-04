import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const runtime = 'edge';
export const maxDuration = 300; // Set timeout to 5 minutes (300 seconds)

export async function POST(req) {
  const { prompt, count, difficulty } = await req.json();
  const systemPrompt = `You are an expert multiple choice question generator. Given a topic, create a concise list of exactly ${count} multiple choice questions with a difficulty level of ${difficulty}% (1% being easiest, 100% being hardest). Each question should:
   1. Focus on a key concept within the topic.
   2. Have a clear, unambiguous question.
   3. Provide four answer options (A, B, C, D), with only one correct answer.
   4. Be suitable for effective learning and assessment.
   5. Match the specified difficulty level.

   Return exactly ${count} questions as a JSON array of objects, each with 'question', 'correctAnswer', 'A', 'B', 'C', and 'D' properties as strings.
   Example format: [{"question": "What is the capital of France?", "correctAnswer": "Paris", "A": "London", "B": "Berlin", "C": "Paris", "D": "Madrid"}]`;

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
    try {
      if (result && typeof result === 'object' && 'text' in result) {
        questions = JSON.parse(result.text);
      } else if (typeof result === 'string') {
        questions = JSON.parse(result);
      } else {
        throw new Error('Unexpected result format');
      }
    } catch (parseError) {
      console.error('Error parsing result:', parseError);
      console.error('Raw result:', result);
      throw new Error(`Failed to parse the generated questions: ${parseError.message}`);
    }

    if (!Array.isArray(questions)) {
      console.error('Generated result is not an array:', questions);
      throw new Error('Generated result is not an array');
    }

    const invalidQuestions = questions.filter(q => !q.question || !q.correctAnswer || !q.A || !q.B || !q.C || !q.D);
    if (invalidQuestions.length > 0) {
      console.error('Invalid questions:', invalidQuestions);
      throw new Error(`Invalid question structure for ${invalidQuestions.length} question(s)`);
    }

    return Response.json({ questions });
  } catch (error) {
    console.error('Error generating multiple choice questions:', error);
    return Response.json({ 
      error: error.message, 
      details: error.stack,
      rawResult: result 
    }, { status: 500 });
  }
}
