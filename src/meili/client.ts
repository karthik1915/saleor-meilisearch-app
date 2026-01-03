import "dotenv/config";
import { MeiliSearch } from "meilisearch";

const host = process.env.MEILI_HOST;
const apiKey = process.env.MEILI_MASTER_KEY;

if (!host) throw new Error("MEILI_HOST is missing");
if (!apiKey) throw new Error("MEILI_MASTER_KEY is missing");

export const meili = new MeiliSearch({
  host,
  apiKey,
});
