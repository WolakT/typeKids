import Link from 'next/link';
import type { Lesson } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

interface LessonCardProps {
  lesson: Lesson;
}

export function LessonCard({ lesson }: LessonCardProps) {
  return (
    <Card className="flex flex-col transform hover:scale-105 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-2xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{lesson.title}</CardTitle>
        <CardDescription>{lesson.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-sm font-medium mr-2">Keys:</span>
          {lesson.keys.map((key) => (
            <Badge key={key} variant="secondary" className="font-mono text-lg p-2 bg-primary/10 text-primary font-bold">
              {key}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href={`/lessons/${lesson.id}`}>
            Start Lesson <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
