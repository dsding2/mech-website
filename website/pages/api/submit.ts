// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // const userId = req.headers["authorization"];
  // const formData = req.body;
  res.status(200).json({ name: "John Doe" });
}
