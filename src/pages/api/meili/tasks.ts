import type { NextApiRequest, NextApiResponse } from "next";
import { meili } from "@/meili/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");

  try {
    const tasks = await meili.tasks.getTasks({
      limit: 50,
    });

    const normalized = tasks.results.map((t) => ({
      uid: t.uid,
      indexUid: t.indexUid,
      type: t.type,
      status: t.status,
      error: t.error || null,
      duration:
        t.finishedAt && t.startedAt
          ? new Date(t.finishedAt).getTime() - new Date(t.startedAt).getTime()
          : null,
      enqueuedAt: t.enqueuedAt,
    }));

    res.status(200).json(normalized);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
