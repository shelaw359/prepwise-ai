import { z } from 'zod';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';

const scheduleItemSchema = z.object({
  day: z.number(),
  topics: z.string().min(1),
  duration: z.string().min(1),
});

export const scheduleSchema = z.array(scheduleItemSchema).min(1);

export type ScheduleItem = z.infer<typeof scheduleItemSchema>;

interface GeneratePlanParams {
  subject: string;
  topics: string;
  examDate: string;
}

/**
 * Calls the Groq API to generate a day-by-day study plan.
 * Returns a validated array of { day, topics, duration } items.
 */
export async function generateStudyPlan({
  subject,
  topics,
  examDate,
}: GeneratePlanParams): Promise<ScheduleItem[]> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('Server is missing GROQ_API_KEY environment variable.');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exam = new Date(examDate + 'T00:00:00');
  const daysRemaining = Math.max(
    1,
    Math.ceil((exam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  );

  const prompt = `You are an expert study planner. Create a day-by-day study schedule.

Subject: ${subject}
Topics: ${topics}
Exam date: ${examDate}
Total days available: ${daysRemaining}

Distribute the topics evenly across the ${daysRemaining} available days (day 1 to day ${daysRemaining}). For each day, assign a specific focus area and a recommended study duration.

Respond with ONLY a JSON array (no markdown, no code fence, no explanation) in this exact format:
[
  { "day": 1, "topics": "Algebra Basics", "duration": "2 hours" },
  { "day": 2, "topics": "Linear Equations", "duration": "2 hours" }
]

Rules:
- "day" must be an integer starting at 1 and increasing sequentially up to ${daysRemaining}.
- "topics" must be a short, specific focus area for that day.
- "duration" must be a string like "2 hours" or "1.5 hours".
- Output ONLY the JSON array. Nothing else.`;

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You are an expert study planner that responds with valid JSON only. Never include markdown formatting or explanations.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(
      `Groq API request failed (${response.status}): ${errText.slice(0, 200)}`
    );
  }

  const data = await response.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('Groq returned an empty response.');
  }

  // Strip any stray markdown fences in case the model adds them despite instructions.
  const cleaned = content
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('Groq returned a response that was not valid JSON.');
  }

  const result = scheduleSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error('Groq returned a schedule with an unexpected structure.');
  }

  return result.data;
}
