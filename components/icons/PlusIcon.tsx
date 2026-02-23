type PlusIconProps = {
  className?: string;
  strokeWidth?: number;
};

export function PlusIcon({
  className = "h-4 w-4",
  strokeWidth = 2,
}: PlusIconProps) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={strokeWidth}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
    </svg>
  );
}
