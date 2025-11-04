"use client";
import React from "react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";

const World = dynamic(() => import("@/components/ui/globe").then((m) => m.World), {
  ssr: false,
});

export default function GlobeDemo() {
  // Toronto coordinates: 43.6532° N, 79.3832° W
  const torontoLat = 43.6532;
  const torontoLng = -79.3832;
  
  // Hong Kong coordinates: 22.3193° N, 114.1694° E
  const hongKongLat = 22.3193;
  const hongKongLng = 114.1694;
  
  const globeConfig = {
    pointSize: 2,
    globeColor: "#062056",
    showAtmosphere: true,
    atmosphereColor: "#FFFFFF",
    atmosphereAltitude: 0.1,
    emissive: "#062056",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 3000, // 3 seconds for the arc animation
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: hongKongLat, lng: hongKongLng },
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };
  const colors = ["#06b6d4", "#3b82f6", "#6366f1"];
  
  // Single arc from Toronto to Hong Kong
  const sampleArcs = [
    {
      order: 1,
      startLat: torontoLat,
      startLng: torontoLng,
      endLat: hongKongLat,
      endLng: hongKongLng,
      arcAlt: 0.3,
      color: colors[0], // Bright cyan color
    },
  ];

  return (
    <div className="flex flex-row items-center justify-center py-20 h-screen md:h-auto dark:bg-black bg-blue-500 relative w-full">
      <div className="max-w-7xl mx-auto w-full relative overflow-hidden h-full md:h-[40rem] py-8 bg-red-500">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
          }}
          className="div"
        >
          <h2 className="text-center text-xl md:text-4xl font-bold text-black dark:text-white">
            We sell soap worldwide
          </h2>
          <p className="text-center text-base md:text-lg font-normal text-neutral-700 dark:text-neutral-200 max-w-md mt-2 mx-auto leading-tight">
            This globe is interactive and customizable. Have fun with it, and
            don&apos;t forget to share it. :)
          </p>
        </motion.div>
        {/* <div className="absolute w-full bottom-0 inset-x-0 h-40 bg-gradient-to-b pointer-events-none select-none from-transparent dark:to-black to-white z-40" /> */}
        <div className="absolute w-full -bottom-16 h-72 md:h-full z-10 bg-black">
          <World data={sampleArcs} globeConfig={globeConfig} />
        </div>
      </div>
    </div>
  );
}
