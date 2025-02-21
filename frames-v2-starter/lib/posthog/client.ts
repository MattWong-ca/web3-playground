import posthog from "posthog-js";

export const trackEvent = (
  event: string,
  data: Record<string, unknown>,
) => {
  if (process.env.NEXT_PUBLIC_POSTHOG_DISABLED === "true") {
    return;
  }
  return posthog.capture(event, data);
};
