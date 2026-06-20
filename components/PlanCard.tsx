'use client';

import { useState } from 'react';
import { format, differenceInCalendarDays } from 'date-fns';
import {
  CalendarClock,
  ChevronDown,
  Clock,
  ListTodo,
  BookMarked,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { StudyPlan } from '@/lib/types';

interface PlanCardProps {
  plan: StudyPlan;
}

export function PlanCard({ plan }: PlanCardProps) {
  const [expanded, setExpanded] = useState(false);

  const examDate = new Date(plan.exam_date + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysLeft = differenceInCalendarDays(examDate, today);
  const isPast = daysLeft < 0;

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      {/* Header (clickable) */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-accent/40"
      >
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold truncate">{plan.subject}</h3>
            <Badge
              variant={isPast ? 'secondary' : 'default'}
              className={cn(
                'shrink-0',
                !isPast && 'bg-primary/10 text-primary hover:bg-primary/15'
              )}
            >
              <CalendarClock className="h-3 w-3" />
              {isPast
                ? 'Exam passed'
                : daysLeft === 0
                ? 'Exam today'
                : `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {format(examDate, 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:inline text-sm text-muted-foreground">
            {plan.schedule.length} day{plan.schedule.length === 1 ? '' : 's'}
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border">
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform duration-200',
                expanded && 'rotate-180'
              )}
            />
          </div>
        </div>
      </button>

      {/* Expandable content */}
      <div
        className={cn(
          'grid transition-all duration-300 ease-in-out',
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t px-5 py-4 space-y-4">
            {/* Topics list */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm font-medium">
                <BookMarked className="h-4 w-4 text-primary" /> Topics
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                {plan.topics}
              </p>
            </div>

            {/* Schedule */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <ListTodo className="h-4 w-4 text-primary" /> Schedule
              </div>
              <ul className="space-y-2 pl-6">
                {plan.schedule.map((item) => (
                  <li
                    key={item.day}
                    className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                      {item.day}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{item.topics}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <Clock className="h-3 w-3" /> {item.duration}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-muted-foreground pt-1">
              Created {format(new Date(plan.created_at), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
