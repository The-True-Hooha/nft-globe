import Image from "next/image";
import { Inter } from "next/font/google";
import SmoothScroll from "@/lib/smooth-scroll";
import GlobeMain from "@/components/3d-globe";

// const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <GlobeMain/>
      {/* // <SmoothScroll> */}
      <main></main>
    </div>
    // </SmoothScroll>
  );
}
