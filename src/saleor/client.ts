import "dotenv/config";
import { saleorApp } from "@/saleor-app";
import { GraphQLClient } from "graphql-request";

const saleorApiUrl = process.env.SALEOR_API_URL!;

export async function getAppSaleorClient() {
  const authData = await saleorApp.apl.get(saleorApiUrl);

  if (!authData) {
    console.error("No auth data available");

    return new GraphQLClient(process.env.SALEOR_API_URL!);
  }

  return new GraphQLClient(authData.saleorApiUrl, {
    headers: {
      Authorization: `Bearer ${authData.token}`,
    },
  });
}
