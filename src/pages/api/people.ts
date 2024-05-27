import mysql from "mysql";
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
  if (req.method === "GET") {
    const results = await prisma.person.findMany({
      where: {
        uid: req.uid,
      },
    });
    console.log(results);
    res.json(results);
  } else if (req.method === "POST") {
    await prisma.person.create({
      data: {
        name: req.body.name,
        gender: req.body.gender,
        note: req.body.note,
        photo: req.body.photo,
        birth_date: req.body.bath_date,
        uid: req.body.uid,
      },
    });
  }
};
export default handler;
