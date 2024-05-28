import mysql from "mysql";
import type { NextApiRequest, NextApiResponse } from "next";
import { initializeApp, cert, getApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "@/serviceAccountKey.json";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { Req } from "@/firebaseAdmin";

getApps().length === 0
  ? initializeApp({ credential: cert(serviceAccount as unknown as string) })
  : getApp();

export const handler = async (req: Req, res: NextApiResponse) => {
  try {
    const token = req.headers.authorization?.replace(/^Bearer\s/g, "");
    if (token) {
      const user = await getAuth().verifyIdToken(token);
      req.uid = user.uid;
      req.email = user.email;
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      await prisma.person.delete({
        where: {
          id: parseInt(id as string),
        },
      });
      res.status(200).send("ok");
    } else if (req.method === "PUT") {
      const { id } = req.query;
     await prisma.person.update({
        where: {
          id: parseInt(id as string),
        },
        data: {
          name: req.body.name,
          gender: req.body.gender,
          birth_date: req.body.birth_date,
          note: req.body.note,
          uid: req.body.uid,
          photo: req.body.photo,
        },
      });
      res.status(200).send("ok");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;
