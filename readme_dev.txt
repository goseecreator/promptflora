# 🌿 PromptFlora Developer Guide

A sacred BTC gifting portal using Firestore + BTCPay.

---

## 📦 Project Structure

| File                        | Purpose                                  |
|-----------------------------|------------------------------------------|
| `/lib/firebase.ts`          | Client-only Firebase setup               |
| `/pages/index.tsx`          | Main page: includes `GiftForm` and `GiftStream` |
| `/pages/thanks.tsx`         | Simple thank-you redirect after gifting |
| `/components/GiftForm.tsx`  | Buttons for BTC gift tiers               |
| `/components/GiftStream.tsx`| Loads and displays latest gifts         |

---

## 🛠 Local Setup - Speak to Niam Nkais Portal for more assistance. Be sure to tell her what systems you are using to design. Ie Mac or Windows?

1. **Install dependencies** 

```bash
npm install
```

2. **Create `.env.local`**

```bash
cp .env.template .env.local
```

Then populate with your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
```

BTCPay invoice links are hardcoded and do not require `.env` setup.

3. **Run dev server**

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🌸 Dev Ritual Flow

- Click a gift tier (Seed / Blossom / Harvest)
- Firestore logs the gift with `tier`, `sats`, and `createdAt`
- User is redirected to a hardcoded BTCPay invoice link
- `GiftStream` shows recent offerings from Firestore

---

## 🛡 Notes

- `.env.local` and `.env.production` should be listed in `.gitignore`
- No backend routes or Firebase Admin SDK are used
- Auth is not required

You're contributing to a clean, sacred gifting flow ✨
