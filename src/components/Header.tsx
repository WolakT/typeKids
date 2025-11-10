import Link from 'next/link';
import { TypeKidsLogo } from './icons/TypeKidsLogo';

export function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2">
          <TypeKidsLogo className="h-8 w-8 text-primary" />
          <span className="font-headline text-2xl font-bold text-primary">
            TypeKids
          </span>
        </Link>
      </div>
    </header>
  );
}
