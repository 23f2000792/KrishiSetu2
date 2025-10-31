import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 11.13 4.12 10.29 4.34 9.5L14.5 19.66C13.71 19.88 12.87 20 12 20ZM17.5 16.4L8.6 7.5C9.35 6.64 10.32 6.03 11.4 5.72L12 5.76V5.75C16.41 5.75 20 9.34 20 13.75C20 14.77 19.78 15.73 19.39 16.59L17.5 16.4Z"
          fill="currentColor"
        />
        <path 
            d="M12 5.75C9.32 5.75 7.01 7.43 5.86 9.5H5.85L14.75 18.41V18.4C15.93 16.99 16.24 14.99 15.65 13.24L12.96 10.54L15.09 8.41L17.5 10.82V10.81C17.5 8.02 15.02 5.75 12 5.75Z" 
            fill="currentColor" opacity="0.6"
        />
      </svg>
      <span className="font-headline text-lg font-semibold text-foreground">
        KrishiSetu
      </span>
    </div>
  );
}
