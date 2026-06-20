'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
  Calendar as CalendarIcon,
  Loader2,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface FormState {
  subject: string;
  topics: string;
  examDate: Date | undefined;
}

interface FieldErrors {
  subject?: string;
  topics?: string;
  examDate?: string;
}

export function StudyForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    subject: '',
    topics: '',
    examDate: undefined,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  function validate(): boolean {
    const next: FieldErrors = {};
    if (!form.subject.trim()) next.subject = 'Please enter a subject.';
    if (!form.topics.trim()) next.topics = 'Please enter at least one topic.';
    if (!form.examDate) {
      next.examDate = 'Please select an exam date.';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (form.examDate < today) {
        next.examDate = 'Exam date cannot be in the past.';
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError(null);

    if (loading) return;
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        subject: form.subject.trim(),
        topics: form.topics.trim(),
        examDate: format(form.examDate!, 'yyyy-MM-dd'),
      };

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        const message = data?.error ?? 'Something went wrong.';
        setGlobalError(message);
        toast.error(message);
        return;
      }

      toast.success('Study plan generated!');
      router.push('/plans');
    } catch {
      const message = 'Network error. Please try again.';
      setGlobalError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Subject */}
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          placeholder="e.g. Mathematics"
          value={form.subject}
          disabled={loading}
          onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
          aria-invalid={!!errors.subject}
        />
        {errors.subject && (
          <p className="flex items-center gap-1 text-sm text-destructive">
            <AlertCircle className="h-3.5 w-3.5" /> {errors.subject}
          </p>
        )}
      </div>

      {/* Topics */}
      <div className="space-y-2">
        <Label htmlFor="topics">Topics to cover</Label>
        <Textarea
          id="topics"
          placeholder="e.g. Algebra, Geometry, Calculus, Trigonometry"
          className="min-h-[110px]"
          value={form.topics}
          disabled={loading}
          onChange={(e) => setForm((f) => ({ ...f, topics: e.target.value }))}
          aria-invalid={!!errors.topics}
        />
        {errors.topics && (
          <p className="flex items-center gap-1 text-sm text-destructive">
            <AlertCircle className="h-3.5 w-3.5" /> {errors.topics}
          </p>
        )}
      </div>

      {/* Exam Date */}
      <div className="space-y-2">
        <Label>Exam date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              className={cn(
                'w-full justify-start text-left font-normal',
                !form.examDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="h-4 w-4" />
              {form.examDate
                ? format(form.examDate, 'PPP')
                : 'Pick your exam date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={form.examDate}
              onSelect={(d) =>
                setForm((f) => ({ ...f, examDate: d ?? undefined }))
              }
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.examDate && (
          <p className="flex items-center gap-1 text-sm text-destructive">
            <AlertCircle className="h-3.5 w-3.5" /> {errors.examDate}
          </p>
        )}
      </div>

      {/* Global error */}
      {globalError && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{globalError}</span>
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating your plan...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Generate Study Plan
          </>
        )}
      </Button>
    </form>
  );
}
