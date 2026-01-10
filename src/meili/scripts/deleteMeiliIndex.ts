import "dotenv/config";
import { meili } from "../client";

export default async function deleteMeiliIndexes(index?: string | string[]) {
  if (!index) {
    await Promise.all([meili.deleteIndex("products"), meili.deleteIndex("categories")]);
    console.log("All indexes deleted");
    return;
  }

  const indexes = Array.isArray(index) ? index : [index];

  await Promise.all(indexes.map((i) => meili.deleteIndex(i)));

  console.log(`Deleted indexes: ${indexes.join(", ")}`);
}
