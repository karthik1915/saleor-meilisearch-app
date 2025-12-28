import type { NextApiRequest, NextApiResponse } from "next";
import { meili } from "@/meili/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");

  const { index, operation } = req.query;

  const indexName = typeof index === "string" ? index : "";
  const op = typeof operation === "string" ? operation : "";

  try {
    switch (op) {
      case "delete-indexes":
        const { results } = await meili.getIndexes();
        await Promise.all(results.map((i) => meili.deleteIndex(i.uid)));
        return res.status(200).json({ success: true });

      case "delete-index":
        if (indexName.length) {
          await meili.deleteIndex(indexName);
          return res.status(200).json({ success: true });
        }

      case "update-index":
        if (!indexName) {
          return res.status(400).json({ error: "index required" });
        }
        // await meili.index(indexName).updateSettings({});
        return res.status(200).json({ success: true });

      default:
        return res.status(400).json({ error: "invalid operation" });
    }
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
