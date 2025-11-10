'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { lessons } from '@/lib/lessons';
import type { Lesson, ExerciseStats } from '@/lib/types';
import { TypingExercise } from '@/components/TypingExercise';
import { ExerciseResults } from '@/components/ExerciseResults';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Progress } from '@/components/ui/progress';

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const lessonId = Number(params.lessonId);
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const foundLesson = lessons.find((l) => l.id === lessonId);
    if (foundLesson) {
      setLesson(foundLesson);
    } else {
      router.push('/');
    }
  }, [lessonId, router]);

  const handleExerciseComplete = (stats: ExerciseStats) => {
    setExerciseStats(stats);
    setShowResults(true);
  };

  const handleNextExercise = () => {
    if (lesson && currentExerciseIndex < lesson.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setShowResults(false);
      setExerciseStats(null);
    } else {
      router.push('/');
    }
  };

  const handleTryAgain = () => {
    setShowResults(false);
    setExerciseStats(null);
  };

  if (!lesson) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading lesson...</p>
      </div>
    );
  }

  const currentExercise = lesson.exercises[currentExerciseIndex];
  const progressPercentage = ((currentExerciseIndex + 1) / lesson.exercises.length) * 100;

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 bg-background">
        <div className="w-full max-w-4xl">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-3xl font-bold font-headline text-primary">{lesson.title}</h1>
              <span className="text-lg font-medium text-muted-foreground">
                Exercise {currentExerciseIndex + 1} / {lesson.exercises.length}
              </span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
          </div>

          {!showResults ? (
            <TypingExercise
              key={currentExercise.id}
              exercise={currentExercise}
              onComplete={handleExerciseComplete}
            />
          ) : exerciseStats && (
            <ExerciseResults
              stats={exerciseStats}
              lessonId={lesson.id}
              exerciseId={currentExercise.id}
              onNext={handleNextExercise}
              onTryAgain={handleTryAgain}
              isLastExercise={currentExerciseIndex === lesson.exercises.length - 1}
            />
          )}

          <div className="mt-8 flex justify-between w-full">
            <Button variant="outline" onClick={() => router.push('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Lessons
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
