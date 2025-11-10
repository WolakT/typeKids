'use server';

/**
 * @fileOverview An AI agent that provides personalized learning recommendations based on a user's typing performance.
 *
 * - generatePersonalizedRecommendations - A function that generates personalized exercise recommendations.
 * - PersonalizedRecommendationsInput - The input type for the generatePersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the generatePersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  accuracy: z.number().describe('The accuracy of the user in the last lesson (0-100).'),
  timeTaken: z.number().describe('The time taken by the user to complete the last lesson in seconds.'),
  currentLesson: z.string().describe('The name of the current lesson the user is on.'),
  lessonsCompleted: z.number().describe('The total number of lessons completed by the user.'),
});
export type PersonalizedRecommendationsInput = z.infer<
  typeof PersonalizedRecommendationsInputSchema
>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendation: z
    .string()
    .describe(
      'A personalized recommendation for the user, suggesting specific exercises or areas for improvement.'
    ),
});
export type PersonalizedRecommendationsOutput = z.infer<
  typeof PersonalizedRecommendationsOutputSchema
>;

export async function generatePersonalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are an AI typing tutor. Based on the learner\'s performance, give them a specific recommendation for how to improve.

Here is the learner\'s performance data:
- Accuracy: {{accuracy}}%
- Time Taken: {{timeTaken}} seconds
- Current Lesson: {{currentLesson}}
- Lessons Completed: {{lessonsCompleted}}

Recommendation:`,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
