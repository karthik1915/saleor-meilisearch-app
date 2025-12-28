import { GraphQLClient } from "graphql-request";

export const saleorClient = new GraphQLClient(process.env.SALEOR_API_URL!);
