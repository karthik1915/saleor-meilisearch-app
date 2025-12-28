import "dotenv/config";

import { saleorClient } from "../saleor/client";
import { PUBLIC_PRODUCTS_QUERY } from "../saleor/queries";
import { transformProduct } from "../transformers/product";
import { meili } from "../meili/client";

export async function indexAllProducts() {
  let after: string | null = null;
  const documents: any[] = [];

  while (true) {
    const res: any = await saleorClient.request(PUBLIC_PRODUCTS_QUERY, { first: 50, after });

    for (const edge of res.products.edges) {
      documents.push(transformProduct(edge.node));
    }

    if (!res.products.pageInfo.hasNextPage) break;
    after = res.products.pageInfo.endCursor;
  }

  await meili.index("products").addDocuments(documents);
}
