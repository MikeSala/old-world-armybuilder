/**
 * Common prop types used across multiple components.
 * Reduces duplication of similar prop patterns.
 */

/**
 * Common props for components that accept className
 */
export type WithClassName = {
  className?: string;
};

/**
 * Common props for components with optional style overrides
 */
export type WithOptionalStyle = WithClassName & {
  style?: React.CSSProperties;
};

/**
 * Common callback patterns
 */
export type OnChange<T> = {
  onChange: (value: T) => void;
};

export type OnClick = {
  onClick: () => void;
};
