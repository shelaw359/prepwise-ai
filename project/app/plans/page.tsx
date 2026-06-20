import { supabase } from '@/lib/supabase';
import { PlanCard } from '@/components/PlanCard';
import { CalendarX2, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { StudyPlan } from '@/lib/types';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'My Plans — PrepWise AI',
  description: 'View your saved AI-generated study plans.',
};

export default async function PlansPage() {
  const { data, error } = await supabase
    .from('study_plans')
    .select('id, subject, topics, exam_date, schedule, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-md space-y-4 text-center">
          <h2 className="text-2xl font-semibold">Couldn&apos;t load plans</h2>
          <p className="text-muted-foreground">
            Something went wrong while fetching your study plans. Please try
            again later.
          </p>
        </div>
      </div>
    );
  }

  const plans = (data ?? []) as StudyPlan[];

  if (plans.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-md space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <CalendarX2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            No study plans yet — create your first one!
          </h2>
          <p className="text-muted-foreground">
            Generate a personalized day-by-day schedule and it&apos;ll show up
            here.
          </p>
          <Button asChild size="lg" className="mt-2">
            <Link href="/">
              <Plus className="h-4 w-4" /> Create a plan
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Study Plans</h1>
          <p className="text-muted-foreground mt-1">
            {plans.length} plan{plans.length === 1 ? '' : 's'} saved
          </p>
        </div>
        <Button asChild>
          <Link href="/">
            <Plus className="h-4 w-4" /> New plan
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
}
