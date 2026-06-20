import { StudyForm } from '@/components/StudyForm';
import {
  Sparkles,
  CalendarClock,
  Clock,
  Target,
  GraduationCap,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="relative bg-[#0F172A] min-h-screen">
      {/* Hero background */}
      <div className="absolute inset-0 -z-10 bg-grid h-[600px] opacity-10 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
      <div className="absolute inset-x-0 -z-10 h-[700px] bg-gradient-to-b from-indigo-950/50 via-[#0F172A] to-[#0F172A]" />

      <section className="container mx-auto px-4 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-slate-400">
          <Sparkles className="h-3.5 w-3.5 text-blue-400" />
          AI-powered study planning
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-slate-50">
          Study smarter with a <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            personalized AI plan
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">
          Tell PrepWise AI your subject, the topics you need to cover, and your
          exam date. We&apos;ll build a day-by-day schedule you can actually
          follow.
        </p>
      </section>

      {/* Feature highlights */}
      <section className="container mx-auto px-4 pb-8">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
          <Feature
            icon={<Target className="h-5 w-5" />}
            title="Tailored"
            desc="Topics split by day"
          />
          <Feature
            icon={<CalendarClock className="h-5 w-5" />}
            title="Time-aware"
            desc="Fits your timeline"
          />
          <Feature
            icon={<Clock className="h-5 w-5" />}
            title="Balanced"
            desc="Daily durations set"
          />
          <Feature
            icon={<GraduationCap className="h-5 w-5" />}
            title="Exam-ready"
            desc="Finish before exam day"
          />
        </div>
      </section>

      {/* Form card */}
      <section className="container mx-auto px-4 pb-20">
        <div className="mx-auto max-w-xl">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-lg sm:p-8">
            <div className="mb-6 space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-50">
                Create your study plan
              </h2>
              <p className="text-sm text-slate-400">
                Fill in the details below and let AI do the planning.
              </p>
            </div>
            <StudyForm />
          </div>
        </div>
      </section>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-50">{title}</p>
        <p className="text-xs text-slate-400">{desc}</p>
      </div>
    </div>
  );
}