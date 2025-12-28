import { gql } from "graphql-request";

export const PUBLIC_PRODUCTS_QUERY = gql`
  query AllProducts($first: Int!, $after: String, $channel: String!) {
    products(first: $first, after: $after, channel: $channel) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          name
          slug
          description
          updatedAt
          isAvailableForPurchase
          thumbnail {
            url
          }
          pricing {
            priceRange {
              start {
                net {
                  amount
                  currency
                }
              }
            }
          }
          category {
            id
            name
            slug
          }
          collections {
            id
            name
            slug
          }
          assignedAttributes {
            attribute {
              id
              slug
              name
              withChoices
              choices(first: 50) {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const PUBLIC_CATEGORY_QUERY = gql`
  query GetCategoriesForIndexing($first: Int!, $after: String) {
    categories(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          name
          slug
          level
          description
          backgroundImage {
            url
          }
          parent {
            id
            name
          }
        }
      }
    }
  }
`;
