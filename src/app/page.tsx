
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion"; // Added Framer Motion

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
    <div className="relative min-h-screen w-full flex justify-center bg-black overflow-y-auto overflow-x-hidden py-10 md:py-0 md:items-center">
      
      {/* THE LOCKED STAGE */}
      <div className="relative w-full max-w-[100vw] aspect-[4/5] sm:h-[90vh] md:h-full md:max-h-screen bg-black shadow-2xl flex-shrink-0">
        
        {/* The Background Image */}
        {bgImage && (
          <div
            suppressHydrationWarning
            className="fixed left-0 top-0 w-full h-screen bg-center bg-no-repeat bg-black"
            style={{ 
              backgroundImage: `url(${bgImage})`, 
              backgroundSize: '900px auto', 
              paddingTop: '100vh', 
              backgroundAttachment: 'scroll',
              // marginTop: '10vh', 
            }}
          />
        )}

        {/* 1. TOP LOGO */}
        <div className="absolute top-[8%] w-full flex flex-col items-center">
           <div className="flex items-center gap-4 text-white/90">
             <div className="h-[2px] w-8 md:w-12 bg-white/40" />
             <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
               {/* BEMA <span className="text-[#ef433e]">HUB</span> */}
             </h1>
             <div className="h-[2px] w-8 md:w-12 bg-white/40" />
           </div>
        </div>

        {/* 2. THE BUTTON - Enhanced with Framer Motion */}
<div className="absolute top-[62%] w-full flex justify-center px-10">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }} // Slightly less "jumpy" scale
    whileTap={{ scale: 0.98 }}
    className="w-full max-w-[260px]" // Dropped max-width slightly from 280px
  >
    <Button
      asChild
      className="w-full bg-[#ef433e] hover:bg-[#d63936] text-white 
                 font-bold py-6 text-lg rounded-xl shadow-[0_10px_30px_rgba(239,67,62,0.3)]
                 transition-colors border-b-4 border-black/20"
    >
      <Link href="/core">
        Start Your Journey
      </Link>
    </Button>
  </motion.div>
</div>

        {/* 3. BOTTOM TEXT */}
        <div className="absolute bottom-[8%] w-full text-center px-6">
          <h2 className="text-white font-black text-3xl md:text-5xl uppercase italic leading-none tracking-tighter drop-shadow-lg">
            {/* Seize Your Opportunity */}
          </h2>
          <h3 className="text-[#ef433e] font-black text-2xl md:text-4xl uppercase italic leading-none tracking-tighter mt-1">
            {/* Elevate Your Future */}
          </h3>
        </div>

        {/* Premium Vignette Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/80" />
      </div>
    </div>
  );
}


// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";

// const backgroundImages = [
//   "https://cdn.jsdelivr.net/gh/kore4lyf/public@master/images/bema-hub/advert-1.webp",
//   "https://cdn.jsdelivr.net/gh/kore4lyf/public@master/images/bema-hub/advert-2.webp",
//   "https://cdn.jsdelivr.net/gh/kore4lyf/public@master/images/bema-hub/advert-3.webp",
// ];

// export default function Home() {
//   const [bgImage, setBgImage] = useState("");

//   useEffect(() => {
//     const randomIndex = Math.floor(Math.random() * backgroundImages.length);
//     setBgImage(backgroundImages[randomIndex]);
//   }, []);

//   return (
//     <div className="relative min-h-screen bg-black">
//       {bgImage && (
//         <div
//           suppressHydrationWarning
//           className="fixed inset-0 bg-contain bg-center bg-no-repeat bg-black"
//           style={{ backgroundImage: `url(${bgImage})` }}
//         />
//       )}
//       <main className="relative z-10 flex h-screen flex-col items-center justify-end p-8">
//         <Button asChild className="absolute bottom-[200px] bg-[#ef433e] hover:bg-[#d63936]">
//           <Link href="/core">
//             Start Your Journey
//           </Link>
//         </Button>
//       </main>
//     </div>
//   );
// }
