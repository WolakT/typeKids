'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Exercise, ExerciseStats } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TypingExerciseProps {
  exercise: Exercise;
  onComplete: (stats: ExerciseStats) => void;
}

export function TypingExercise({ exercise, onComplete }: TypingExerciseProps) {
  const [userInput, setUserInput] = useState('');
  const [errorIndexes, setErrorIndexes] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [animatedIndex, setAnimatedIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const textToType = exercise.text;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') {
      return;
    }
    
    e.preventDefault();

    if (!startTime) {
      setStartTime(Date.now());
    }
    
    if (e.key === 'Backspace') {
      setUserInput((prev) => prev.slice(0, -1));
      setErrorIndexes((prev) => prev.filter((i) => i !== userInput.length - 1));
      return;
    }

    // Ignore inputs that are not single characters (like 'Enter')
    if (e.key.length !== 1) {
        return;
    }

    if (userInput.length >= textToType.length) {
      return;
    }

    if (e.key !== textToType[userInput.length]) {
      if (!errorIndexes.includes(userInput.length)) {
        setErrorIndexes((prev) => [...prev, userInput.length]);
      }
    }
    
    setUserInput((prev) => prev + e.key);
  }, [userInput, textToType, startTime, errorIndexes]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    // Focus the hidden input to capture keystrokes, especially on mobile
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (userInput.length > 0) {
      const lastCharIndex = userInput.length - 1;
      if (userInput[lastCharIndex] === textToType[lastCharIndex] && !errorIndexes.includes(lastCharIndex)) {
        setAnimatedIndex(lastCharIndex);
        setTimeout(() => setAnimatedIndex(null), 200);
      }
    }
  }, [userInput, textToType, errorIndexes]);

  useEffect(() => {
    if (userInput.length === textToType.length && startTime) {
      const endTime = Date.now();
      const timeTaken = (endTime - startTime) / 1000; // in seconds
      const wordsTyped = textToType.split(' ').length;
      const wpm = timeTaken > 0 ? Math.round((wordsTyped / timeTaken) * 60) : 0;
      const accuracy = ((textToType.length - errorIndexes.length) / textToType.length) * 100;

      onComplete({
        accuracy: parseFloat(accuracy.toFixed(2)),
        wpm,
        time: parseFloat(timeTaken.toFixed(2)),
        errors: errorIndexes.length,
      });
    }
  }, [userInput, textToType, startTime, errorIndexes.length, onComplete]);

  return (
    <Card onClick={() => inputRef.current?.focus()} className="cursor-text">
      <CardContent className="p-8">
        <div className="relative text-3xl sm:text-4xl md:text-5xl font-mono tracking-wider break-all font-bold select-none">
          {textToType.split('').map((char, index) => {
            const isTyped = index < userInput.length;
            const isCorrect = isTyped && userInput[index] === char;
            const isError = isTyped && userInput[index] !== char;
            const isCurrent = index === userInput.length;

            return (
              <span
                key={index}
                className={cn('transition-colors duration-200 p-1 rounded', {
                  'text-primary': isCorrect,
                  'text-destructive': isError,
                  'bg-destructive/20': isError,
                  'text-muted-foreground/50': !isTyped && !isCurrent,
                  'text-foreground': isCurrent,
                  'border-b-4 border-accent animate-pulse': isCurrent,
                  'pop': index === animatedIndex,
                })}
              >
                {char}
              </span>
            );
          })}
           {/* Hidden input for mobile keyboard */}
          <input ref={inputRef} type="text" className="opacity-0 absolute w-0 h-0" />
        </div>
        <p className="text-center text-muted-foreground mt-8 text-lg">
          {!startTime ? 'Start typing to begin the exercise...' : 'Keep going!'}
        </p>
      </CardContent>
    </Card>
  );
}
