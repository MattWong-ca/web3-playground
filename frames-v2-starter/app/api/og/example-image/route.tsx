import { ImageResponse } from "next/og";
import React from "react";

export const dynamic = "force-dynamic";
const size = {
  width: 1200,
  height: 800,
};

async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(
    text
  )}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}

export async function GET() {
  const fontData = await loadGoogleFont("Press+Start+2P", "Example image");
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000000",
        }}
      >
        <p
          style={{
            fontSize: "48px",
            color: "#ffffff",
            fontFamily: "PressStart2P",
            textAlign: "center",
          }}
        >
          Example Image
        </p>
      </div>
    ) as React.ReactElement,
    {
      ...size,
      fonts: [
        {
          name: "PressStart2P",
          data: fontData,
          style: "normal",
        },
      ],
    }
  );
}
