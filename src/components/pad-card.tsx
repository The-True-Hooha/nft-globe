import React, { useEffect, useState } from "react";
import fetchPadDataResult from "@/lib/fetch.data";
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(dna || "");
  };

  return (
    <div className="w-[300px] rounded-lg bg-gradient-to-br from-[#77C6A7] font-silkscreen to-[#4EA8A3] shadow-lg p-4">
      <h2 className="text-white text-xl font-bold flex font-silkscreen justify-center">
        {name}
      </h2>
      <button className="absolute top-4 right-4 text-white" onClick={onClose}>
        close
      </button>
      <div className="flex flex-col items-center justify-center p-4">
        <div className="w-full mb-4">
          {imageData && (
            <img
              alt={name}
              className="h-[200px] w-full object-cover rounded-md"
              src={`/assets/pads/${imageData?.image}`}
            />
          )}
        </div>
        <div className="w-full mb-2">
          <div className="text-white text-sm font-medium">DNA</div>
          <div className="text-white text-sm font-normal">
            {dna && dna.split("", 15)}
          </div>
        </div>
        <div className="w-full">
          <div className="text-white text-sm font-medium">Attributes</div>
          <div className="text-white">
            {attributes?.map((attr, index) => (
              <div key={index} className="flex justify-between">
                <span className="font-normal lowercase">{attr.trait_type}</span>
                <span>{attr.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-4"
        onClick={copyToClipboard}
      >
        Copy ID
      </button>
    </div>
  );
}
