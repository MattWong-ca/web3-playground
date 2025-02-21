"use client";

import dynamic from "next/dynamic";

const Demo = dynamic(() => import("../components/Demo"));

export default function App() {
  return <Demo />;
}
