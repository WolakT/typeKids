import type { SVGProps } from 'react';

export function TypeKidsLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M10 13l-4 4l-4-4" />
        <path d="M22 17v-5.33a2 2 0 0 0-1.2-1.8L16 7.2a2 2 0 0 1-1.2-1.8V2" />
        <path d="M6 17v-5.33a2 2 0 0 1 1.2-1.8L12 7.2a2 2 0 0 0 1.2-1.8V2" />
        <path d="M2 17h20" />
    </svg>
  );
}
