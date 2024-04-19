import React, { useEffect, useState } from "react";
import PadCard from "@/components/pad-card";
import { AiOutlineSearch } from "react-icons/ai";
import { FiFilter } from "react-icons/fi";
import { BsSortDownAlt } from "react-icons/bs";
import Image from "next/image";
import fetchPadDataResult, { PadDataI } from "@/lib/fetch.data";
import Link from "next/link";
import router from "next/router";

export default function ZoomComponent() {
  const [pads, setPads] = useState<PadDataI[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch pad data from the server and set the state
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPadDataResult();
      setPads(data.slice(0, 10));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    // Perform any other actions here
    router.push("/");
  };

  return (
    <div className="bg-[#77C6A7] flex justify-center w-[150%] h-full">
      <div className="w-full max-w-7xl px-4">
        <div className="flex items-center justify-between mb-4">
          <button
            className="text-white bg-gray-600 mt-[30px] hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 "
            onClick={handleButtonClick}
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? "Loading..." : "X"}
          </button>

          <div className="flex items-center">
            {/* <AiOutlineSearch className="mr-2" />
            <input
              type="text"
              placeholder="Search pads"
              className="border border-gray-300 rounded-md py-2 px-4"
            /> */}
          </div>
          {/* <div className="flex items-center">
            <FiFilter className="mr-2" />
            <BsSortDownAlt className="ml-2" />
          </div> */}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pads.map((pad) => (
            <PadCard key={pad.dna} imageData={pad} onClose={() => {}} />
          ))}
        </div>
      </div>
    </div>
  );
}