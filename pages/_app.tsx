import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navibar";


export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
          <Navbar />
      <Toaster position="top-right" />
      <Component {...pageProps} />
    </>
  );
}
