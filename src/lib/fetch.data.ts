interface Attribute {
  trait_type: string;
  value: string;
}

interface PadDataI {
  name: string;
  description: string;
  image: string;
  dna: string;
  edition: number;
  date: number;
  attributes: Attribute[];
  compiler: string;
}

export default async function fetchPadDataResult() {
  try {
    const data = await fetch("/pads-data.json");
    const padData: PadDataI[] = await data.json();
    return padData;
  } catch (err) {
    console.log(err);
    return [];
  }
}
