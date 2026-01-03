import type { NextApiRequest, NextApiResponse } from "next";
import { meili } from "@/meili/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    const { q = "", limit = "12", offset = "0", sort, ...rest } = req.query;

    const parsedLimit = parseInt(limit as string);
    const parsedOffset = parseInt(offset as string);

    const sortArray = sort ? [sort as string] : [];

    const filterArray: string[] = [];

    Object.entries(rest).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        const orFilter = value.map((v) => `${key} = "${v}"`).join(" OR ");
        filterArray.push(`(${orFilter})`);
      } else if (key.endsWith("_min")) {
        filterArray.push(`${key.replace("_min", "")} >= ${value}`);
      } else if (key.endsWith("_max")) {
        filterArray.push(`${key.replace("_max", "")} <= ${value}`);
      } else {
        filterArray.push(`${key} = "${value}"`);
      }
    });

    const filters = filterArray.join(" AND ");

    const result = await meili.multiSearch({
      queries: [
        {
          indexUid: "products",
          q: q as string,
          limit: parsedLimit,
          offset: parsedOffset,
          filter: filters,
          sort: sortArray,
        },
        {
          indexUid: "categories",
          q: q as string,
          limit: 4,
        },
      ],
    });

    res.json(result);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
