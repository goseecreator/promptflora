import { getFirestore } from "firebase-admin/firestore";
import { onCall } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";

const db = getFirestore();

type LogGiftData = {
  project: string;
  tier: string;
  amount: number;
  timestamp?: number;
};

export const logGift = onCall<LogGiftData>(async (request) => {
  const { data, auth } = request;

  // ✅ Ensure user is authenticated
  if (!auth) {
    logger.warn("Unauthenticated call to logGift");
    throw new Error("Authentication is required.");
  }

  const { project, tier, amount, timestamp } = data;

  // ✅ Basic input validation
  if (
    typeof project !== "string" ||
    typeof tier !== "string" ||
    typeof amount !== "number"
  ) {
    logger.error("Invalid data format in logGift", data);
    throw new Error("Invalid data format.");
  }

  const entry = {
    project,
    tier,
    amount,
    timestamp: timestamp ?? Date.now(),
    uid: auth.uid,
  };

  try {
    const docRef = await db.collection("gifts").add(entry);
    logger.info(`Gift logged with ID: ${docRef.id}`, entry);
    return { success: true, id: docRef.id };
  } catch (error: unknown) {
    const err = error as Error;
    logger.error("Error logging gift", err.message);
    throw new Error("Failed to log gift.");
  }
});
