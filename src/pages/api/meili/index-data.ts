import type { NextApiRequest, NextApiResponse } from "next";
import { meili } from "@/meili/client";
import { getSafeId } from "@/utils/safeId";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { productId } = req.query;

  if (!productId || typeof productId !== "string") {
    return res.status(400).json({ error: "Missing productId" });
  }

  try {
    const index = meili.index("products");
    const document = await index.getDocument(getSafeId(productId));

    res.status(200).json({
      uid: "products",
      document,
    });
  } catch (e) {
    res.status(200).json({
      uid: "products",
      document: null,
    });
  }
}
