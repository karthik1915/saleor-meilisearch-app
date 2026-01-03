import { saleorApp } from "@/saleor-app";
import { GraphQLClient } from "graphql-request";

export async function getAppSaleorClient() {
  const authData = await saleorApp.apl.get("http://localhost:8000/graphql/");

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
