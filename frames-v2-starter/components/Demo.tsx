"use client";

import { useFrame } from "./context/FrameContext";
import { useSignIn } from "@/hooks/use-sign-in";
import { useUser } from "@/hooks/use-user-me";
import { useEffect, useState } from "react";
import { useUpdateUser } from "@/hooks/use-update-user";

export default function Demo() {
  const { isSDKLoaded, safeAreaInsets } = useFrame();
  const { signIn, logout, isSignedIn, isLoading, error } = useSignIn();
  const { data: user, refetch: refetchUser } = useUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const [customName, setCustomName] = useState("");

  useEffect(() => {
    refetchUser();
  }, [isSignedIn, refetchUser]);

  if (!isSDKLoaded) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-2">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        Loading...
      </div>
    );
  }

  return (
    <div
      className="h-screen flex flex-col items-center justify-center gap-4 p-2"
      style={{
        marginTop: safeAreaInsets.top,
        marginBottom: safeAreaInsets.bottom,
        marginLeft: safeAreaInsets.left,
        marginRight: safeAreaInsets.right,
      }}
    >
      <a
        href="https://builders.garden"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-4"
      >
        <img
          src="/images/builders-garden-logo.png"
          alt="Builders Garden"
          className="h-8"
        />
      </a>

      <h1 className="text-2xl font-bold">Frames v2 demo</h1>

      <p className="text-sm text-gray-500 text-center max-w-md mb-4">
        This demo is made for developers to quickly get started with Frames v2
        integration
      </p>

      {error && <p className="text-red-500">{error}</p>}

      {!isSignedIn ? (
        <button
          onClick={() => signIn()}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
        >
          {isLoading ? "Signing in..." : "Sign in with Farcaster"}
        </button>
      ) : (
        <div className="flex flex-col items-center gap-4">
          {user && (
            <div className="text-center text-white">
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="w-16 h-16 rounded-full mx-auto mb-2"
              />
              <p className="font-medium">Welcome, {user.username}</p>
              <p className="text-gray-600">FID: {user.fid}</p>
              <p className="text-gray-600">
                {user.customName || "No custom name set"}
              </p>

              <div className="mt-4 flex flex-col gap-2">
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Enter custom name"
                  className="px-3 py-2 rounded-lg border border-gray-300 text-black"
                />
                <button
                  onClick={() => {
                    updateUser(
                      { customName },
                      {
                        onSuccess: () => {
                          refetchUser();
                        },
                      }
                    );
                    setCustomName("");
                  }}
                  disabled={isUpdating || !customName}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-green-300"
                >
                  {isUpdating ? "Updating..." : "Update Name"}
                </button>
              </div>
            </div>
          )}
          <button
            onClick={() => logout()}
            className="mt-8 px-4 py-2 bg-red-500 w-full text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      )}

      <a
        href="https://github.com/builders-garden/frames-v2-starter"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 text-sm text-gray-500 hover:text-gray-400 transition-colors"
      >
        View on GitHub
      </a>
    </div>
  );
}
