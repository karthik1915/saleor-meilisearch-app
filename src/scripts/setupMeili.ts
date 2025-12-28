import "dotenv/config";
import { meili } from "@/meili/client";
import { saleorClient } from "@/saleor/client";
import { transformProduct } from "@/transformers/product";
import { transformTaxonomy } from "@/transformers/taxonamy";
import { PUBLIC_PRODUCTS_QUERY, PUBLIC_CATEGORY_QUERY } from "@/saleor/queries";
import { CategoryCountableConnection, ProductCountableConnection } from "@/generated/graphql";

export async function setupIndexes() {
  console.log("Starting Meilisearch indexing...");

  // -------------------
  //  Index Products
  // -------------------
  let hasNextPage = true;
  let after: string | null = null;
  let totalIndexed = 0;

  try {
    await meili.createIndex("products", { primaryKey: "id" });
    while (hasNextPage) {
      const productsData = (await saleorClient.request(PUBLIC_PRODUCTS_QUERY, {
        first: 5, // small batch to avoid query cost limit
        after,
        channel: "default-channel",
      })) as { products: ProductCountableConnection };

      const edges = productsData.products.edges ?? [];
      const pageInfo = productsData.products?.pageInfo;

      if (!edges || edges.length === 0) break;
      if (!pageInfo) {
        console.warn("No pageInfo in productsData:", JSON.stringify(productsData, null, 2));
        break;
      }

      const products = edges.map((e: any) => transformProduct(e.node));

      await meili.index("products").addDocuments(products);

      totalIndexed += products.length;
      console.log(`Indexed ${products.length} products (total: ${totalIndexed})`);

      hasNextPage = productsData.products.pageInfo.hasNextPage;
      after = productsData.products.pageInfo.endCursor!;
    }

    await meili.index("products").updateSettings({
      searchableAttributes: ["name", "category_name", "description_plain"],
      filterableAttributes: ["category_slug", "price_amount", "color", "size", "brand"],
      sortableAttributes: ["price_amount", "updated_at", "name", "brand"],
      rankingRules: ["words", "typo", "proximity", "attribute", "sort", "exactness"],
    });

    console.log(`Products indexing complete: ${totalIndexed} products indexed.`);

    // -------------------
    //  Index Categories (with pagination)
    // -------------------
    let catNextPage = true;
    let catAfter: string | null = null;
    let totalCategories = 0;

    await meili.createIndex("categories", { primaryKey: "id" });
    while (catNextPage) {
      const categoryData = (await saleorClient.request(PUBLIC_CATEGORY_QUERY, {
        first: 5,
        after: catAfter,
      })) as { categories: CategoryCountableConnection };

      const edges = categoryData.categories.edges;
      if (!edges || edges.length === 0) break;

      const categories = edges.map((e: any) => transformTaxonomy(e.node));
      await meili.index("categories").addDocuments(categories);

      totalCategories += categories.length;
      console.log(`Indexed ${categories.length} categories (total: ${totalCategories})`);

      catNextPage = categoryData.categories.pageInfo.hasNextPage;
      catAfter = categoryData.categories.pageInfo.endCursor!;
    }

    await meili.index("categories").updateSettings({
      searchableAttributes: ["name"],
      filterableAttributes: ["slug", "level"],
    });

    console.log(`Categories indexing complete: ${totalCategories} categories indexed.`);
    console.log("Meilisearch indexing finished successfully.");

    return true;
  } catch (err) {
    console.log("Error While Running Setup Script:", err);
    return false;
  }
}
