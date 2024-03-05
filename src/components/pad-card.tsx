import React, { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { MdOutlineContentCopy } from "react-icons/md";
import gsap from "gsap";
import Marquee from "react-fast-marquee";
import Image from "next/image";
interface Attribute {
  trait_type: string;
  value: string;
}

interface ImageData {
  name: string;
  description: string;
  image: string;
  dna: string;
  edition: number;
  date: number;
  attributes: Attribute[];
  compiler: string;
}

export default function PadCard({
  imageData,
  onClose,
}: {
  imageData: ImageData;
  onClose: any;
}) {
  const { name, description, image, dna, attributes } = imageData || {};
  const [copied, setCopied] = useState(false);
  const nodeRef = useRef(null);

  const copyToClipboard = (id: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(id).then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1500);
      });
    } else {
      // Fallback for browsers that do not support clipboard API
      console.error("Clipboard API not supported");
    }
  };
  useEffect(() => {
    const showDNA = gsap.fromTo(
      ".dna-text",
      { opacity: 0, translateY: 20 },
      {
        opacity: 1,
        translateY: 0,
        duration: 2,
        ease: "elastic.out(1, 0.4)",
        stagger: 0.1,
      }
    );
    return () => {
      showDNA.kill();
    };
  }, []);
  return (
    <Draggable>
      <div className="dna-text w-[320px] h-[590px] rounded-lg bg-gradient-to-br from-[#77C6A7] font-silkscreen to-[#4EA8A3] shadow-lg p-4 relative">
        <h2 className="text-white text-xl font-bold flex font-silkscreen justify-center">
          {name}
        </h2>
        <button className="absolute top-4 right-4 text-white" onClick={onClose}>
          close
        </button>
        <div className="flex flex-col items-center justify-center p-4">
          <div className="w-full mb-4 flex justify-center">
            {imageData && (
              <Image
                alt={name}
                className="h-[200px] w-full object-cover rounded-md"
                src={`/assets/pads/${imageData?.image}`}
                width={200}
                height={200}
                priority={true}
              />
            )}
          </div>
          <Marquee direction="right" speed={40} className="mt-[-19px]">
            <div className="dna-text text-white whitespace-wrap font-medium text-[22px] font-silkscreen p-6">
              DNA:: {dna}
            </div>
          </Marquee>

          <div className="w-full">
            <div className="pb-[10px] font-medium font-silkscreen text-[#215f3a] flex justify-between">
              trait type<span>value</span>
            </div>
            <div className="text-white">
              {attributes?.map((attr, index) => (
                <div key={index} className="flex justify-between font-mono">
                  <span className="font-normal lowercase">
                    {attr.trait_type}
                  </span>
                  <span>{attr.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            className="bg-[#183f2f] hover:bg-[#316938] text-white font-bold py-2 px-4 rounded-full"
            onClick={() => {
              copyToClipboard(imageData.dna);
            }}
            id="copyButton"
            title="copy id"
          >
            {copied ? (
              <div>copied</div>
            ) : (
              <div>
                <MdOutlineContentCopy fill="#77C6A7" size={20} />
              </div>
            )}
          </button>
        </div>
      </div>
    </Draggable>
  );
}
