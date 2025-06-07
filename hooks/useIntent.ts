import { useRouter } from "next/router";

export function useIntent(): string {
  const { query } = useRouter();
  const intent = query.intent;

  if (typeof intent === "string") return intent;
  if (Array.isArray(intent)) return intent[0];
  return "";
}
