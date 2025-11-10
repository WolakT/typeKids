'use client';

import { useState, useEffect } from 'react';
import type { ExerciseStats } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Award, BrainCircuit, RefreshCw, ArrowRight, Loader2 } from 'lucide-react';
import { getAIAssessment } from '@/lib/actions';

interface ExerciseResultsProps {
  stats: ExerciseStats;
  lessonId: number;
  exerciseId: number;
  onNext: () => void;
  onTryAgain: () => void;
  isLastExercise: boolean;
}

export function ExerciseResults({ stats, lessonId, exerciseId, onNext, onTryAgain, isLastExercise }: ExerciseResultsProps) {
  const [stars, setStars] = useState(0);
  const [aiFeedback, setAiFeedback] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  useEffect(() => {
    let newStars = 0;
    if (stats.accuracy >= 98) {
      newStars = 3;
    } else if (stats.accuracy >= 95) {
      newStars = 2;
    } else if (stats.accuracy >= 90) {
      newStars = 1;
    }
    // A reasonable time could be based on WPM > 10 for beginners.
    // If they are too slow, reduce a star.
    if (newStars > 1 && stats.wpm < 10) {
        newStars--;
    }
    setStars(newStars);
  }, [stats]);
  
  const handleGetFeedback = async () => {
    setIsLoadingAi(true);
    const result = await getAIAssessment({ ...stats, lessonId, exerciseId });
    setAiFeedback(result.recommendation);
    setIsLoadingAi(false);
  };

  useEffect(() => {
    handleGetFeedback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onNext]);

  return (
    <Card className="w-full text-center animate-in fade-in-50 zoom-in-95">
      <CardHeader>
        <CardTitle className="text-4xl font-bold font-headline text-primary">
          <Award className="inline-block h-10 w-10 mr-2" />
          Great Job!
        </CardTitle>
        <div className="flex justify-center mt-4">
          {[1, 2, 3].map((i) => (
            <Star
              key={i}
              className={`h-12 w-12 transition-all duration-500 ease-in-out ${
                i <= stars ? 'text-accent fill-accent' : 'text-muted-foreground/30'
              }`}
              style={{ transform: i <= stars ? 'scale(1.1)' : 'scale(1)', transitionDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-lg mb-8">
          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="font-bold text-primary">Accuracy</div>
            <div className="text-3xl font-bold">{stats.accuracy}%</div>
          </div>
          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="font-bold text-primary">WPM</div>
            <div className="text-3xl font-bold">{stats.wpm}</div>
          </div>
          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="font-bold text-primary">Time</div>
            <div className="text-3xl font-bold">{stats.time}s</div>
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-background min-h-[120px] flex flex-col justify-center">
          <div className="flex items-center justify-center mb-4">
             <BrainCircuit className="h-6 w-6 mr-2 text-primary" />
             <h3 className="text-xl font-semibold">AI Coach</h3>
          </div>
          {isLoadingAi ? (
             <div className="flex items-center justify-center text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing your performance...
             </div>
          ) : (
            <p className="text-muted-foreground italic">"{aiFeedback}"</p>
          )}
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Button variant="outline" onClick={onTryAgain}>
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
          <Button onClick={onNext} className="bg-accent text-accent-foreground hover:bg-accent/90">
            {isLastExercise ? 'Finish Lesson' : 'Next Exercise'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
