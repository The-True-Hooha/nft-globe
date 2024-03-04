import React from "react";

interface ImageData {
  name: string;
  description: string;
  image: any;
  dna: string;
  attributes: any[];
}

export default function PadCard({ imageData }: { imageData: ImageData }) {
  const { name, description, image, dna, attributes } = imageData;

  return (
    <div className="w-[300px] rounded-lg bg-gradient-to-br from-[#77C6A7] to-[#4EA8A3] shadow-lg p-4">
      <h2 className="text-white text-xl font-bold flex font-silkscreen justify-center">
        {name}
      </h2>
      <div className="flex flex-col items-center justify-center p-4">
        <div className="w-full mb-4">
          <img
            alt={name}
            className="h-[200px] w-full object-cover rounded-md"
            src={image}
          />
        </div>
        <div className="w-full mb-2">
          <div className="text-white text-sm font-medium font-octaBrain">
            DNA
          </div>
          <div className="text-white text-lg font-semibold">{dna}</div>
        </div>
        <div className="w-full">
          <div className="text-white text-sm font-octaBrain font-medium">
            Attributes
          </div>
          <div className="text-white">
            {attributes.map((attr, index) => (
              <div key={index} className="flex justify-between">
                <span className="font-normal lowercase font-octaBrain">
                  {attr.trait_type}
                </span>
                <span>{attr.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-[#77C6A7] to-[#4EA8A3] shadow- p-4">
        <div className="text-white text-sm">{description}</div>
      </div>
    </div>
  );
}
