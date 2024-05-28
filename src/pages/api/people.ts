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
  try {
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
      res.status(200).json(results);
      res.send("ok");
    } else if (req.method === "POST") {
      const newPerson = await prisma.person.create({
        data: {
          name: req.body.name,
          gender: req.body.gender,
          note: req.body.note,
          photo: req.body.photo,
          birth_date: req.body.birth_date,
          uid: req.body.uid,
        },
      });
      res.status(200).json(newPerson);
      res.send("ok");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;
