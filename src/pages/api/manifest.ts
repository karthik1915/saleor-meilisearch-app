import { AppExtension, AppManifest } from "@saleor/app-sdk/types";
import { createManifestHandler } from "@saleor/app-sdk/handlers/next";

import packageJson from "@/package.json";

export default createManifestHandler({
  async manifestFactory({ appBaseUrl, request, schemaVersion }) {
    const iframeBaseUrl = process.env.APP_IFRAME_BASE_URL ?? appBaseUrl;
    const apiBaseURL = process.env.APP_API_BASE_URL ?? appBaseUrl;

    const extensionsForSaleor3_22: AppExtension[] = [
      {
        url: iframeBaseUrl + "/client-widget",
        permissions: [],
        mount: "PRODUCT_DETAILS_WIDGETS",
        label: "Product Search Index Data",
        target: "WIDGET",
        options: {
          widgetTarget: {
            method: "POST",
          },
        },
      },
    ];

    const saleorMajor = schemaVersion && schemaVersion[0];
    const saleorMinor = schemaVersion && schemaVersion[1];

    const is3_22 = saleorMajor === 3 && saleorMinor === 22;

    const extensions = is3_22 ? extensionsForSaleor3_22 : [];

    const manifest: AppManifest = {
      name: "Meili Search for Saleor",
      tokenTargetUrl: `${apiBaseURL}/api/register`,
      appUrl: iframeBaseUrl,
      permissions: [],
      id: "search.saleor.app",
      version: packageJson.version,
      webhooks: [],
      extensions: extensions,
      author: "Aahrbitx",
      brand: {
        logo: {
          default: `${apiBaseURL}/logo.png`,
        },
      },
    };

    return manifest;
  },
});
