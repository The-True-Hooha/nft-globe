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

  const filterLiquid = attributes.filter((v) => v.trait_type !== "liquid")

  const copyToClipboard = (id: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(id).then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1500);
      });
    } else {
      
      console.error("Clipboard API not supported");
    }
  };

  const handleCopy = () => {
    copyToClipboard(imageData.dna)
  }

  const handleClose = () => {
    onClose()
  }

  const handleTouchCopy = (event: React.TouchEvent<HTMLButtonElement>) => {
    event.preventDefault()
    handleCopy()

  }
  const handleTouchClose = (event: React.TouchEvent<HTMLButtonElement>) => {
    event.preventDefault();
    handleClose();
  };
  return (
    <Draggable>
      <div className="dna-text w-[250px] mx-auto mt-10 lg:w-[320px] lg:h-[590px] rounded-lg bg-gradient-to-br from-[#77C6A7] font-silkscreen to-[#4EA8A3] shadow-lg p-4 relative">
        <div className="text-white text-[18px] lg:text-[25px] font-bold flex font-silkscreen w-full">
          <h2 className="align-middle ml-[70px] lg:ml-[80px]">{name}</h2>
          <button
            className="absolute lg:right-6 right-8 align-middle lg:text-[25px]"
            onClick={handleClose}
            onTouchEnd={handleTouchClose}
            title="close"
          >
            X
          </button>
        </div>
        <div className="flex flex-col items-center justify-center p-4">
          <div className="w-full mb-4 flex justify-center">
            {imageData && (
              <Image
                alt={name}
                className="h-[200px] w-full object-cover rounded-md"
                src={`/assets/pads/${imageData?.image}`}
                width={150}
                height={150}
                priority={true}
              />
            )}
          </div>
          <Marquee
            direction="right"
            speed={40}
            className="lg:mt-[-19px] mt-[-25px]"
          >
            <div className="dna-text text-white whitespace-wrap font-medium text-[20px] lg:text-[22px] font-silkscreen p-6">
              DNA:: {dna}
            </div>
          </Marquee>

          <div className="w-full">
            <div className="lg:pb-[10px] font-medium font-silkscreen text-[#215f3a] flex justify-between">
              trait type<span>value</span>
            </div>
            <div className="text-white font-silkscreen">
              {filterLiquid?.map((attr, index) => (
                <div key={index} className="flex justify-between">
                  <span className="font-normal lowercase">
                    {attr.trait_type}
                  </span>
                  <span className="text-right ml-4">{attr.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            className="bg-[#183f2f] hover:bg-[#316938] text-white font-bold py-2 px-4 rounded-full"
            onClick={handleCopy}
            onTouchEnd={handleTouchCopy}
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
