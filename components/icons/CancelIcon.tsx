type CancelIconProps = {
  className?: string;
  strokeWidth?: number;
};

export function CancelIcon({
  className = "h-4 w-4",
  strokeWidth = 2,
}: CancelIconProps) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={strokeWidth}
    >
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M4.93 4.93l14.14 14.14" />
    </svg>
  );
}
