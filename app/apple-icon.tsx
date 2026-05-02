import { ImageResponse } from 'next/og';

/** iOS / Safari tab switcher & home screen — requires PNG `apple-touch-icon`, not `.ico`. */
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
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
          borderRadius: 45,
        }}
      >
        <span
          style={{
            fontSize: 84,
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
