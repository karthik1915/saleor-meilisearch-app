export const runtime = "edge";

import { meili } from "@/meili/client";
import { NextResponse } from "next/server";

export default async function handler(req: Request) {
  if (req.method !== "GET") {
    return new NextResponse(JSON.stringify({ message: "Method not allowed" }), { status: 405 });
  }

  try {
    const { searchParams } = new URL(req.url);

    // 1. Basic Params
    const q = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "12");
    const offset = parseInt(searchParams.get("offset") || "0");
    const sort = searchParams.get("sort") ? [searchParams.get("sort")!] : [];

    // 2. Advanced Filtering Logic
    const filterArray: string[] = [];

    // Map through all search params to build filters
    searchParams.forEach((value, key) => {
      // Skip pagination/search keys
      if (["q", "limit", "offset", "sort"].includes(key)) return;

      // Handle Range Filters (e.g., price_amount_min=10 -> price_amount >= 10)
      if (key.endsWith("_min")) {
        const field = key.replace("_min", "");
        filterArray.push(`${field} >= ${value}`);
      } else if (key.endsWith("_max")) {
        const field = key.replace("_max", "");
        filterArray.push(`${field} <= ${value}`);
      }
      // Handle Equality Filters (e.g., brand=Nike -> brand = "Nike")
      else {
        // We use getAll to support multiple checkboxes of same name (?brand=Nike&brand=Adidas)
        const values = searchParams.getAll(key);
        if (values.length > 1) {
          const orFilter = values.map((v) => `${key} = "${v}"`).join(" OR ");
          filterArray.push(`(${orFilter})`);
        } else {
          filterArray.push(`${key} = "${value}"`);
        }
      }
    });

    const filters = filterArray.join(" AND ");

    const multiSearchResponse = await meili.multiSearch({
      queries: [
        {
          indexUid: "products",
          q,
          limit,
          offset,
          filter: filters,
          sort: sort,
          attributesToRetrieve: [
            "id",
            "name",
            "slug",
            "price_amount",
            "currency",
            "variant_name",
            "variant_price_amount",
            "variant_currency",
            "thumbnail_src",
            "category_name",
            "category_slug",
          ],
        },
        {
          indexUid: "categories",
          q,
          limit: 4,
          attributesToRetrieve: ["id", "name", "slug"],
        },
      ],
    });

    return NextResponse.json(multiSearchResponse);
  } catch (err: any) {
    console.error("Meilisearch API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
