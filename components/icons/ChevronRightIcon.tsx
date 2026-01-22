type ChevronRightIconProps = {
  className?: string;
  strokeWidth?: number;
};

export function ChevronRightIcon({
  className = "h-5 w-5",
  strokeWidth = 2.5,
}: ChevronRightIconProps) {
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
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
