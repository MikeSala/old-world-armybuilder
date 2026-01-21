type LogoIconProps = {
  className?: string;
};

export function LogoIcon({ className = "h-8 w-8" }: LogoIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Shield background */}
      <path
        d="M24 4L6 12v12c0 11.1 7.68 21.47 18 24 10.32-2.53 18-12.9 18-24V12L24 4z"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Crossed swords */}
      <path
        d="M16 34L32 14M16 14l16 20"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Sword hilts */}
      <path
        d="M14 12h4M30 12h4M14 36h4M30 36h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Center gem */}
      <circle cx="24" cy="24" r="3" fill="currentColor" fillOpacity="0.6" />
    </svg>
  );
}
