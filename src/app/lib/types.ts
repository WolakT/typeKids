export interface Exercise {
  id: number;
  text: string;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  keys: string[];
  exercises: Exercise[];
}

export interface ExerciseStats {
  accuracy: number;
  wpm: number;
  time: number;
  errors: number;
}
