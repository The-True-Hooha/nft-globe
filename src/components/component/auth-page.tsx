import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardContent, Card } from "@/components/ui/card";
import Marquee from "react-fast-marquee";
import { useState } from "react";
import { useRouter } from "next/router";

export function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [isNewAccount, setIsNewAccount] = useState(true);
  const [responseMessage, setResponseMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const data = {
      email: email,
      password: password,
      code: code,
    };

    const route = isNewAccount
      ? process?.env?.NEXT_PUBLIC_API
      : process?.env?.NEXT_PUBLIC_API2;
    try {
      const response = await fetch(`${route}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const resData = await response.json()
        setResponseMessage(resData.message)
        router.push('/dashboard')
      } else {
        const errRes = await response.json()
        setResponseMessage(errRes.message)
      }
    } catch (error: any) {
      setResponseMessage(error.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center lg:h-full bg-gradient-to-br from-[#77C6A7] to-[#4EA8A3]">
      <div className="lg:mb-[30px] text-center">
        <h1 className="lg:text-4xl text-[20px] mb-[20px] font-bold font-silkscreen">
          To Access your account
        </h1>
        <div className="lg:w-[60%] w-[85%] mx-auto">
          <Marquee direction="left" speed={80} className="">
            <p className="text-[15px] lg:mt-[10px] leading-[1.25] font-mono">
              Please enter your email and password
            </p>
          </Marquee>
        </div>
      </div>
      <div className="lg:w-full max-w-sm lg:pt-[50px] w-[350px] mt-[20px] shadow-2xl border rounded-lg ">
        <CardContent className="space-y-4 ">
          <form onSubmit={handleSubmit}>
            <div className="space-y-2 lg:mt-[-35px]">
              <Label htmlFor="email" className="font-silkscreen">
                Email
              </Label>
              <Input
                autoComplete="email"
                className="p-2 border border-gray-200 bg-white rounded-md focus:outline-none focus:ring"
                id="email"
                placeholder="m@example.com"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-silkscreen">
                Password
              </Label>
              <Input
                autoComplete="current-password"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring"
                id="password"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code" className="font-silkscreen">
                CODE
              </Label>
              <Input
                autoComplete="code"
                className="p-2 border bg-green-300 rounded-md focus:outline-none focus:ring"
                id="code"
                required
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="isNewAccount" className="font-mono">
                New Account?
              </Label>
              <input
                className="p-2 border mt-4 bg-green-700 rounded-md focus:outline-none focus:ring"
                id="isNewAccount"
                type="checkbox"
                checked={isNewAccount}
                onChange={(e) => setIsNewAccount(e.target.checked)}
              />
            </div>
            <Button
              className="w-full text-white rounded-md py-2 hover:bg-green-700 focus:outline-none focus:ring"
              type="submit"
              onSubmit={handleSubmit}
            >
              continue
            </Button>
          </form>
          {responseMessage && (
            <div className="mt-4 text-center text-red-800 font-semibold">
              {responseMessage}
            </div>
          )}
        </CardContent>
      </div>
    </div>
  );
}
