// pages/index.tsx
import Head from "next/head";
import GiftForm from "@/components/GiftForm";
import GiftStream from "@/components/GiftStream";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>PromptFlora – Sacred BTC Gifting</title>
        <meta name="description" content="Offer a sacred gift via Lightning. Seed rituals, stream blessings." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="p-6 max-w-xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">Offer a Sacred Gift</h1>
        <GiftForm />
        <GiftStream />
      </main>
    </>
  );
}
