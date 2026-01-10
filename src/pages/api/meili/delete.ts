import deleteMeiliIndexes from "@/meili/scripts/deleteMeiliIndex";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    res.status(405).json({ status: false });
    return;
  }

  const { index } = req.query;

  try {
    const status = await deleteMeiliIndexes(index);
    res.json({ status });
  } catch {
    res.status(500).json({ status: false });
  }
}
