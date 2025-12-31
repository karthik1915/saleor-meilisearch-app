import { APL } from "@saleor/app-sdk/APL";
import { SaleorApp } from "@saleor/app-sdk/saleor-app";
import { FileAPL, FileAPLConfig } from "@saleor/app-sdk/APL/file";
import { UpstashAPL, UpstashAPLConfig } from "@saleor/app-sdk/APL/upstash";

/**
 * By default auth data are stored in the `.auth-data.json` (FileAPL).
 * For multi-tenant applications and deployments please use UpstashAPL.
 *
 * To read more about storing auth data, read the
 * [APL documentation](https://github.com/saleor/saleor-app-sdk/blob/main/docs/apl.md)
 */

export let apl: APL;

switch (process.env.APL) {
  case "UPSTASH":
    const upstashConfig: UpstashAPLConfig = {
      restToken: process.env.UPSTASH_REDIS_REST_TOKEN!,
      restURL: process.env.UPSTASH_REDIS_REST_URL!,
    };
    apl = new UpstashAPL(upstashConfig);
  default:
    const fileAplConfig: FileAPLConfig = {
      fileName: "saleor-app-auth.json",
    };
    apl = new FileAPL(fileAplConfig);
}

export const saleorApp = new SaleorApp({
  apl,
});
