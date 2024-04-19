import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import Marquee from "react-fast-marquee";

const LOADER_THRESHOLD = 250
export default function LoaderUI() {
 
   return (
     <div className="bg-[#77C6A7] min-h-screen absolute w-full flex flex-col items-center justify-center">
       <p className="font-silkscreen text-[25px] font-bold">
         Fronk Cartel
       </p>
       <div className="flex justify-center">
         <Image
           src="/assets/gen/new-bg.svg"
           alt="loader"
           width={500}
           height={500}
         />
       </div>
       <div className="mt-[-30px]">
         <Marquee direction="left" speed={80} className="w-[40px]">
           <p className="text-[25px] font-silkscreen">Loading...</p>
         </Marquee>
       </div>
     </div>
   );
}
