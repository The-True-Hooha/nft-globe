// Import necessary modules
import { useState, useEffect } from "react";
import PadCard from "@/components/pad-card";
import fetchPadDataResult from "@/lib/fetch.data";

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
// Define the functional component
export default function CardPage() {
  // Initialize state for pad data and loading state
  const [padData, setPadData] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch pad data
        const data = await fetchPadDataResult();

        // Check if data is available
        if (data && data.length > 0) {
          // Set pad data with the first item in the array
          setPadData(data[0]);
        }
      } catch (error) {
        console.error("Error fetching pad data:", error);
      } finally {
        // Update loading state
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle close action of PadCard component

  const handleClose = () => {
    const cardDiv = document.createElement("div");
    document.body.removeChild(cardDiv);
  };
  return (
    <div className="container">
      {loading ? (
        <p>Loading...</p>
      ) : (
        padData && <PadCard imageData={padData} onClose={handleClose} />
      )}
    </div>
  );
}
