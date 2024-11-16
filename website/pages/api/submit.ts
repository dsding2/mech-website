// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Submission = {
  team: string;
  team_id: string;
  code: string;
};

const validateInput = (input: unknown): input is Submission => {
  return (
    input !== null &&
    typeof input === "object" &&
    "team" in input &&
    "code" in input &&
    typeof input.team === "string" &&
    typeof input.code === "string"
  );
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const input = req.body;
  console.log("A", req.body);
  if (!validateInput(input)) {
    res.status(400).json({
      message:
        "Invalid input format. Expected an object with 'name' and 'team' fields.",
    });
  }
  res.status(200).json({ name: "John Doe" });
}
