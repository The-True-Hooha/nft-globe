import LoaderUI from "@/components/component/loader";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* <LoaderUI/> */}
      <Component {...pageProps} />
    </>
  );
}
