
import type { NextApiRequest, NextApiResponse } from "next";
import { initializeApp, cert, getApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "@/serviceAccountKey.json";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

getApps().length === 0
  ? initializeApp({ credential: cert(serviceAccount as unknown as string) })
  : getApp();

type Req = NextApiRequest & {
  uid?: string;
  email?: string;
  params: {
    id?: string;
  };
};

export const handler = async (req: Req, res: NextApiResponse) => {
  const token = req.headers.authorization?.replace(/^Bearer\s/g, "");
  if (token) {
    const user = await getAuth().verifyIdToken(token);
    req.uid = user.uid;
    req.email = user.email;
  }
  if (req.method === "POST") {
    const result = await prisma.user.findUnique({
      where: { uid: req.uid },
    });
    if (result) {
      res.send("ok");
    } else {
      await prisma.user.create({
        data: { uid: req.uid as string, email: req.email || "none" },
      });
    }
  }
};

export default handler;
