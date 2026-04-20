// PostHog initialization is handled in app/components/PostHogProvider.tsx
// so we can enforce strict consent before any analytics capture.
export function onRouterTransitionStart(_url: string) {
  // Intentionally no-op.
}
