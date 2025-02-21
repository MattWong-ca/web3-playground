import { Metadata } from "next";
import App from "./app";

const appUrl = process.env.NEXT_PUBLIC_URL;

const frame = {
  version: "next",
  imageUrl: `${appUrl}/images/feed.png`,
  button: {
    title: "Press Me",
    action: {
      type: "launch_frame",
      name: "Frame V2 Starter",
      url: appUrl,
      splashImageUrl: `${appUrl}/images/splash.png`,
      splashBackgroundColor: "#f7f7f7",
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Frame V2 Starter",
    openGraph: {
      title: "Frame V2 Starter",
      description: "A starter for Frame v2",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Home() {
  return <App />;
}
