import { Header } from '@/components/Header';
import { LessonCard } from '@/components/LessonCard';
import { lessons } from '@/lib/lessons';

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-headline font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              <span className="text-primary">Welcome to</span> TypeKids!
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Start your typing adventure today. Select a lesson below to begin.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
