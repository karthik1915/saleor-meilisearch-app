import { meili } from "./client";

export async function setupProductIndex() {
  await meili.createIndex("products", { primaryKey: "id" });

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
