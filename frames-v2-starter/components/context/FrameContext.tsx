"use client";
import {
  FrameContext,
  SafeAreaInsets,
} from "@farcaster/frame-core/dist/context";
import sdk from "@farcaster/frame-sdk";
import { useEffect, useState } from "react";

export const useFrame = () => {
  const [context, setContext] = useState<FrameContext | null>(null);
  const [safeAreaInsets, setSafeAreaInsets] = useState<SafeAreaInsets>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const context = await sdk.context;
        if (context) {
          if (context.client?.safeAreaInsets) {
            setSafeAreaInsets(context.client.safeAreaInsets);
          }
          setContext(context as FrameContext);
        } else {
          setError("Failed to load Farcaster context");
        }
        await sdk.actions.ready();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to initialize SDK"
        );
        console.error("SDK initialization error:", err);
      }
    };

    if (sdk && !isSDKLoaded) {
      console.log("Loading SDK");
      load().then(() => {
        setIsSDKLoaded(true);
        console.log("SDK loaded");
      });
    }
  }, [isSDKLoaded]);

  return {
    context,
    safeAreaInsets,
    isSDKLoaded,
    error,
  };
};
