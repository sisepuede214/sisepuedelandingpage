import { ImageResponse } from 'next/og';

/** PNG favicon for browsers (including many mobile tabs) that ignore or mishandle `.ico`. */
export const size = { width: 48, height: 48 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000',
          borderRadius: 12,
        }}
      >
        <span
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: '#ffffff',
            fontFamily:
              'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          S
        </span>
      </div>
    ),
    { ...size },
  );
}
