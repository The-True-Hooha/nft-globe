import Image from "next/image";
import { Inter } from "next/font/google";
import SmoothScroll from "@/lib/smooth-scroll";
import GlobeMain from "@/components/3d-globe";
import GlobeMain2 from "@/components/get-all-light";
import GlobeWithMakers from "@/components/globe-markers";

// const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <GlobeWithMakers/>
      {/* // <SmoothScroll> */}
      {/* <main></main> */}
    </div>
    // </SmoothScroll>
  );
}
