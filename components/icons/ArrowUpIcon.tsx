type ArrowUpIconProps = {
  className?: string;
  strokeWidth?: number;
};

export function ArrowUpIcon({
  className = "h-4 w-4",
  strokeWidth = 2,
}: ArrowUpIconProps) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={strokeWidth}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7 7 7M12 3v18" />
    </svg>
  );
}
