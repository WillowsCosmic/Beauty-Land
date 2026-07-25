# Firebase Admin Setup Guide

## 1. Install Firebase Admin SDK

```bash
npm install firebase-admin
```

---

## 2. Get the Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project → **Project Settings** (gear icon)
3. Click the **Service accounts** tab
4. Click **Generate new private key** → **Generate key**
5. A `service-account.json` file will download
6. Move it to the **root** of your project

> ⚠️ Never commit this file to GitHub. Make sure `service-account.json` is in your `.gitignore`.

---

## 3. Create the Script to Set Admin Claims

Create a file at the root of your project called `set-admin.mjs`:

```js
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "./service-account.json" with { type: "json" };

initializeApp({
  credential: cert(serviceAccount),
});

// Replace with the UID of the user you want to make admin
const ADMIN_UID = "PASTE_UID_HERE";

async function setAdminClaim() {
  await getAuth().setCustomUserClaims(ADMIN_UID, { role: "admin" });
  console.log("Admin custom claim set successfully!");
  process.exit(0);
}

setAdminClaim().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
```

---

## 4. Find the User's UID

1. Go to Firebase Console → **Authentication** → **Users**
2. Find the user by their email
3. Copy their **UID** (the long string in the UID column)
4. Paste it into `set-admin.mjs` as `ADMIN_UID`

---

## 5. Run the Script

```bash
node set-admin.mjs
```

You should see:
```
Admin custom claim set successfully!
```

> Repeat steps 4–5 for each admin user (primary + emergency).

---

## 6. Verify It Worked (Optional)

You can check the claim was set by adding this temporarily:

```js
const user = await getAuth().getUser("PASTE_UID_HERE");
console.log(user.customClaims); // Should print: { role: 'admin' }
```

---

## 7. Add Admin Emails to `.env.local`

```env
NEXT_PUBLIC_FIREBASE_ADMIN_EMAILS=primaryemail@gmail.com,emergencyemail@gmail.com
```

Comma-separated, no spaces.

---

## How It All Connects

| Step | What it does |
|------|-------------|
| `set-admin.mjs` | Adds `{ role: "admin" }` claim to the user in Firebase |
| Login page | Checks email is in the allowed list, then sends magic link |
| Verify page | Completes the magic link sign-in |
| AuthGuard | Reads the ID token and checks `role === "admin"` before allowing dashboard access |
