import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="64" height="64" rx="12" fill="#111827" />
        <g transform="rotate(-18 32 32)">
          <rect
            x="18"
            y="16"
            width="28"
            height="14"
            rx="3"
            fill="#e5c76e"
            stroke="#3a2c16"
            strokeWidth="2"
          />
          <rect
            x="30"
            y="28"
            width="6"
            height="24"
            rx="3"
            fill="#7d4b24"
            stroke="#3a2c16"
            strokeWidth="2"
          />
          <rect
            x="31"
            y="46"
            width="4"
            height="8"
            rx="2"
            fill="#c0851a"
          />
        </g>
      </svg>
    ),
    {
      ...size,
    }
  );
}
