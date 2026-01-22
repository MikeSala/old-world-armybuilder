type ChevronLeftIconProps = {
  className?: string;
  strokeWidth?: number;
};

export function ChevronLeftIcon({
  className = "h-5 w-5",
  strokeWidth = 2.5,
}: ChevronLeftIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
