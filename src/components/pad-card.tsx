import {
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";

export function PadCard() {
  return (
    <Card className="w-[300px] rounded-lg bg-gradient-to-br from-[#77C6A7] to-[#4EA8A3] shadow-lg">
      <CardHeader>
        <CardTitle className="text-white text-xl font-bold flex font-silkscreen justify-center">
          Card Name
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-4">
        <div className="w-full mb-4">
          <img
            alt="NFT Image"
            className="h-[200px] w-full object-cover rounded-md"
            height="200"
            src="/assets/pads/1.png"
            style={{
              aspectRatio: "200/200",
              objectFit: "cover",
            }}
            width="200"
          />
        </div>
        <div className="w-full mb-2">
          <div className="text-white text-sm font-medium font-octaBrain">
            DNA
          </div>
          <div className="text-white text-lg font-semibold">
            1234567890ABCDEF
          </div>
        </div>
        <div className="w-full">
          <div className="text-white text-sm font-octaBrain font-medium">
            Attributes
          </div>
          <div className="text-white">
            <div className="flex justify-between">
              <span className="font-normal lowercase font-octaBrain">Trait Type 1</span>
              <span>Value 1</span>
            </div>
            <div className="flex justify-between">
              <span className="font-normal lowercase font-octaBrain">Trait Type 2</span>
              <span>Value 2</span>
            </div>
            <div className="flex justify-between">
              <span className="font-normal lowercase font-octaBrain">Trait Type 3</span>
              <span>Value 3</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gradient-to-br from-[#77C6A7] to-[#4EA8A3] shadow- p-4">
        <div className="text-white text-sm">card description</div>
      </CardFooter>
    </Card>
  );
}
