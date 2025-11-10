'use server';

/**
 * @fileOverview Evaluates the results of a typing lesson and determines readiness for the next lesson.
 *
 * - evaluateLesson - A function that evaluates the lesson results.
 * - EvaluationInput - The input type for the evaluateLesson function.
 * - EvaluationOutput - The return type for the evaluateLesson function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EvaluationInputSchema = z.object({
  accuracy: z.number().describe('The accuracy of the lesson (0-100).'),
  timeTaken: z.number().describe('The time taken to complete the lesson in seconds.'),
  errors: z.string().describe('A string containing information about the errors made during the lesson.'),
  lessonNumber: z.number().describe('The lesson number that was completed.'),
});
export type EvaluationInput = z.infer<typeof EvaluationInputSchema>;

const EvaluationOutputSchema = z.object({
  readyForNextLesson: z.boolean().describe('Whether the learner is ready to proceed to the next lesson.'),
  feedback: z.string().describe('Specific feedback for the learner, including areas for improvement.'),
});
export type EvaluationOutput = z.infer<typeof EvaluationOutputSchema>;

export async function evaluateLesson(input: EvaluationInput): Promise<EvaluationOutput> {
  return evaluateLessonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'lessonEvaluationPrompt',
  input: {schema: EvaluationInputSchema},
  output: {schema: EvaluationOutputSchema},
  prompt: `You are an AI typing tutor, providing feedback to young learners on their typing lessons.

You will evaluate the lesson results and determine if the learner is ready to move on to the next lesson.
Consider accuracy, time taken, and the types of errors made. Provide specific feedback to the learner, including areas for improvement.

Lesson Number: {{{lessonNumber}}}
Accuracy: {{{accuracy}}}%
Time Taken: {{{timeTaken}}} seconds
Errors: {{{errors}}}

Based on this information, is the learner ready for the next lesson? {{(readyForNextLesson)}}
Provide specific feedback to the learner, including areas for improvement: {{(feedback)}}`,
});

const evaluateLessonFlow = ai.defineFlow(
  {
    name: 'evaluateLessonFlow',
    inputSchema: EvaluationInputSchema,
    outputSchema: EvaluationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
