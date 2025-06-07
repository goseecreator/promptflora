import { useIntent } from "./useIntent";

const intentMap: Record<string, string> = {
  receive: "Prompt Receiver",
  share: "Project Holder",
  hold: "Session Host",
  witness: "Witness Only",
};

export function useArchetypeFromIntent(): string | null {
  const intent = useIntent();
  return intentMap[intent] || null;
}
