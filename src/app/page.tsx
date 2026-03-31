"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const backgroundImages = [
  "https://cdn.jsdelivr.net/gh/kore4lyf/public@master/images/bema-hub/advert-1.webp",
  "https://cdn.jsdelivr.net/gh/kore4lyf/public@master/images/bema-hub/advert-2.webp",
  "https://cdn.jsdelivr.net/gh/kore4lyf/public@master/images/bema-hub/advert-3.webp",
];

export default function Home() {
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    setBgImage(backgroundImages[randomIndex]);
  }, []);

  return (
    <div className="relative min-h-screen bg-black">
      {bgImage && (
        <div
          suppressHydrationWarning
          className="fixed inset-0 bg-contain bg-center bg-no-repeat bg-black"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}
      <main className="relative z-10 flex h-screen flex-col items-center justify-end p-8">
        <Button asChild className="absolute bottom-[200px] bg-[#ef433e] hover:bg-[#d63936]">
          <Link href="/core">
            Start Your Journey
          </Link>
        </Button>
      </main>
    </div>
  );
}
