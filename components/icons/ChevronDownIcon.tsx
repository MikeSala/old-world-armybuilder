type ChevronDownIconProps = {
  className?: string;
  strokeWidth?: number;
};

export function ChevronDownIcon({
  className = "h-4 w-4",
  strokeWidth = 2,
}: ChevronDownIconProps) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={strokeWidth}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}
