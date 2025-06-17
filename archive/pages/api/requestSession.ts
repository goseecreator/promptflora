import { NextApiRequest, NextApiResponse } from "next";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, applicationDefault } from "firebase-admin/app";

// Initialize Firebase Admin once
const app = initializeApp({ credential: applicationDefault() });
const db = getFirestore(app);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { hostId, requesterId, day, time } = req.body;

    if (!hostId || !requesterId || !day || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const requestRef = db.collection("sessionRequests").doc();
    await requestRef.set({
      hostId,
      requesterId,
      day,
      time,
      status: "pending",
      createdAt: new Date(),
    });

    return res.status(200).json({ message: "Request submitted" });
  } catch (error) {
    console.error("Error submitting request:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
