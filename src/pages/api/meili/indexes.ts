import type { NextApiRequest, NextApiResponse } from "next";
import { meili } from "@/meili/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { results } = await meili.getIndexes();

    const data = await Promise.all(
      results.map(async (idx) => {
        const stats = await meili.index(idx.uid).getStats();

        return {
          uid: idx.uid,
          primaryKey: idx.primaryKey,
          numberOfDocuments: stats.numberOfDocuments,
          isIndexing: stats.isIndexing,
          fields: stats.fieldDistribution,
        };
      })
    );

    res.status(200).json(data);
  } catch (e: any) {
    res.status(500).json({ error: "Failed to load Meili overview" });
  }
}
