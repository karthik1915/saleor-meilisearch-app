import "dotenv/config";
import { meili } from "@/meili/client";
import { getAppSaleorClient } from "@/saleor/client";
import { transformProduct } from "@/transformers/product";
import { transformTaxonomy } from "@/transformers/taxonamy";
import {
  PUBLIC_PRODUCTS_QUERY,
  PUBLIC_CATEGORY_QUERY,
  CHANNELS_LIST_QUERY,
} from "@/saleor/queries";
import {
  Channel,
  CategoryCountableConnection,
  ProductCountableConnection,
} from "@/generated/graphql";

async function setupProductIndexes() {
  const saleorClient = await getAppSaleorClient();

  const channelData = (await saleorClient.request(CHANNELS_LIST_QUERY)) as {
    channels: Channel[];
  };

  await ensureIndex("products", "id");

  for (const channel of channelData.channels) {
    let hasNextPage = true;
    let after: string | null = null;
    let totalIndexed = 0;

    console.log(`Indexing Products from ${channel.name} channel`);

    while (hasNextPage) {
      const productsData = (await saleorClient.request(PUBLIC_PRODUCTS_QUERY, {
        first: 5,
        after,
        channel: channel.slug,
      })) as { products: ProductCountableConnection };

      const edges = productsData.products.edges ?? [];
      if (edges.length === 0) break;

      const products = edges.map((e) => transformProduct(e.node, channel));

      await meili.index("products").addDocuments(products);

      totalIndexed += products.length;
      hasNextPage = productsData.products.pageInfo.hasNextPage;
      after = productsData.products.pageInfo.endCursor!;
    }

    console.log(`Indexing Complete in ${channel.name} channel`);
  }

  await meili.index("products").updateSettings({
    searchableAttributes: ["name", "description", "categories.name", "attributes.*"],
    filterableAttributes: [
      "isPublished",
      "channel",
      "categories.slug",
      "categories.path",
      "availability.inStock",
      "pricing.min",
      "attributes.*",
    ],
    sortableAttributes: ["pricing.min", "createdAt"],
  });
}

async function setupCategoryIndexes() {
  const saleorClient = await getAppSaleorClient();

  let hasNextPage = true;
  let after: string | null = null;

  await ensureIndex("categories", "id");

  while (hasNextPage) {
    const categoryData = (await saleorClient.request(PUBLIC_CATEGORY_QUERY, {
      first: 10,
      after,
    })) as { categories: CategoryCountableConnection };

    const edges = categoryData.categories.edges ?? [];
    if (edges.length === 0) break;

    const categories = edges.map((e) => transformTaxonomy(e.node));

    await meili.index("categories").addDocuments(categories);

    hasNextPage = categoryData.categories.pageInfo.hasNextPage;
    after = categoryData.categories.pageInfo.endCursor!;
  }

  await meili.index("categories").updateSettings({
    searchableAttributes: ["name"],
    filterableAttributes: ["slug", "level"],
  });
}

export async function setupIndexes() {
  try {
    await setupProductIndexes();
    await setupCategoryIndexes();
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function ensureIndex(name: string, primaryKey: string) {
  try {
    await meili.getIndex(name);
  } catch {
    await meili.createIndex(name, { primaryKey });
  }
}
