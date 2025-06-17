// functions/src/index.ts
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as nodemailer from "nodemailer";
import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";
import { defineSecret } from "firebase-functions/params";
import { logger } from "firebase-functions";
import { logGift } from "./logGift";


initializeApp();
const db = getFirestore();

const gmailUser = defineSecret("GMAIL_USER");
const gmailPass = defineSecret("GMAIL_PASS");
export { logGift } from "./logGift";


export const notifySessionRequest = onDocumentCreated({ document: "sessionRequests/{requestId}", secrets: [gmailUser, gmailPass] }, async (event) => {
  const data = event.data?.data();
  if (!data) return;

  const { hostId, day, time } = data;
  const userDoc = await db.doc(`users/${hostId}`).get();
  const email = userDoc.data()?.email;

  if (!email) {
    logger.warn("No email found for host:", hostId);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser.value(),
      pass: gmailPass.value(),
    },
  });

  const mailOptions = {
    from: `"PromptFlora" <${gmailUser.value()}>`,
    to: email,
    subject: "🌸 New Session Request",
    text: `You’ve received a new session request for ${day} at ${time}.\n\nLog in to PromptFlora to respond.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Notification sent to ${email}`);
  } catch (error) {
    logger.error("Email sending failed:", error);
  }
});

export const confirmSessionStatus = onDocumentUpdated({ document: "sessionRequests/{requestId}", secrets: [gmailUser, gmailPass] }, async (event) => {
  const before = event.data?.before?.data();
  const after = event.data?.after?.data();

  if (!before || !after) return;
  if (before.status === after.status) return;

  let recipientId = "";
  let subject = "";
  let text = "";

  if (after.status === "accepted") {
    recipientId = after.requesterId;
    subject = "🌿 Session Accepted";
    text = `Your session request for ${after.day} at ${after.time} has been accepted.`;
  } else if (after.status === "declined") {
    recipientId = after.requesterId;
    subject = "❌ Session Declined";
    text = `Your session request for ${after.day} at ${after.time} has been declined.`;
  } else if (after.status === "cancelled") {
    recipientId = after.hostId;
    subject = "⚠️ Session Cancelled";
    text = `A session request for ${after.day} at ${after.time} was cancelled by the requester.`;
  }

  if (!recipientId) return;

  const userDoc = await db.doc(`users/${recipientId}`).get();
  const email = userDoc.data()?.email;

  if (!email) {
    logger.warn("No email found for:", recipientId);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser.value(),
      pass: gmailPass.value(),
    },
  });

  const mailOptions = {
    from: `"PromptFlora" <${gmailUser.value()}>`,
    to: email,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${email} with subject: ${subject}`);
  } catch (error) {
    logger.error(`Email sending failed for ${subject}:`, error);
  }
}
);
