import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { generateStudyPlan } from '@/lib/groq';
import type { StudyPlan } from '@/lib/types';

export const runtime = 'nodejs';

const bodySchema = z.object({
  subject: z.string().trim().min(1, 'Subject is required').max(120),
  topics: z.string().trim().min(1, 'Topics are required').max(2000),
  examDate: z
    .string()
    .trim()
    .min(1, 'Exam date is required')
    .refine((val) => !Number.isNaN(Date.parse(val)), {
      message: 'Invalid exam date',
    }),
});

export async function POST(req: NextRequest) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON in request body.' },
      { status: 400 }
    );
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Invalid input.';
    return NextResponse.json({ error: firstError }, { status: 422 });
  }

  const { subject, topics, examDate } = parsed.data;

  // Reject past exam dates.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exam = new Date(examDate + 'T00:00:00');
  if (exam.getTime() < today.getTime()) {
    return NextResponse.json(
      { error: 'Exam date cannot be in the past.' },
      { status: 422 }
    );
  }

  // Step 1: Generate the schedule via Groq.
  let schedule;
  try {
    schedule = await generateStudyPlan({ subject, topics, examDate });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to generate study plan.';
    return NextResponse.json(
      { error: `Study plan generation failed: ${message}` },
      { status: 502 }
    );
  }

  // Step 2: Persist to Supabase.
  const { data, error } = await supabase
    .from('study_plans')
    .insert({
      subject,
      topics,
      exam_date: examDate,
      schedule,
    })
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json(
      {
        error: `Failed to save study plan: ${error?.message ?? 'unknown error'}`,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ plan: data as StudyPlan }, { status: 201 });
}
