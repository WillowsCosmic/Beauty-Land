import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "./service-account.json" with { type: "json" };

initializeApp({
  credential: cert(serviceAccount),
});

const ADMIN_UID = "mwcsPVR8T8RsXIIavvxrzncbLW33"; 

async function setAdminClaim() {
  await getAuth().setCustomUserClaims(ADMIN_UID, { role: "admin" });
  console.log("Admin custom claim set successfully!");
  process.exit(0);
}

setAdminClaim().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});