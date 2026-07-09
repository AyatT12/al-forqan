// @ts-nocheck
import { useRef } from "react";

let _pid = 0;

export default function IslamicPattern({ opacity = 0.08 }: { opacity?: number }) {
  const id = useRef(`ip-${_pid++}`).current;
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id={id} width="56" height="56" patternUnits="userSpaceOnUse">
          <g stroke="#8B6914" fill="none" strokeWidth="0.7">
            <polygon points="28,4 32,18 46,22 32,26 28,40 24,26 10,22 24,18" />
            <polygon
              points="28,10 30.5,19 39,22 30.5,25 28,34 25.5,25 17,22 25.5,19"
              strokeWidth="0.35"
            />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} opacity={opacity} />
    </svg>
  );
}
