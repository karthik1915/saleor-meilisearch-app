import "dotenv/config";
import { meili } from "../meili/client";

export default async function deleteMeiliIndexes() {
  await meili.deleteIndex("products");
  await meili.deleteIndex("categories");
  console.log("Index deleted");
}
