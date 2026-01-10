import { setupIndexes } from "@/meili/scripts/setupMeili";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const status = setupIndexes();

    // boolean returned while setting up indexes
    res.json({ status: status });
  } else {
    res.json({ status: false });
  }
}
