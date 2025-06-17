import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gosee.view@gmail.com",
    pass: "jnzcnvqduxefelwy", // NOT your Gmail password!
},
});

export const notifySessionRequest = functions.firestore
  .document("sessionRequests/{requestId}")
  .onCreate(async (snap, context) => {
    const { hostId, date, time } = snap.data();
    const userDoc = await admin.firestore().doc(`users/${hostId}`).get();
    const email = userDoc.data()?.email;

    if (!email) {
      console.log("⚠️ No email found for host:", hostId);
      return;
    }

    const mailOptions = {
      from: '"PromptFlora" <your-email@gmail.com>',
      to: email,
      subject: "🌸 New Session Request",
      text: `You’ve received a new session request for ${date} at ${time}.\n\nLog in to PromptFlora to respond.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Notification sent to ${email}`);
    } catch (error) {
      console.error("❌ Email sending failed:", error);
    }
  });
