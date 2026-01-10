import { gql } from "graphql-request";

export const PRODUCT_INDEX_FRAGMENT = gql`
  fragment ProductIndexData on Product {
    id
    name
    slug
    description
    updatedAt
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
    isAvailableForPurchase
    thumbnail {
      url
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
`;

export const PUBLIC_PRODUCTS_QUERY = gql`
  ${PRODUCT_INDEX_FRAGMENT}
  query AllProducts($first: Int!, $after: String, $channel: String!) {
    products(first: $first, after: $after, channel: $channel) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ...ProductIndexData
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

export const CHANNELS_LIST_QUERY = gql`
  query getAllChannels {
    channels {
      id
      name
      slug
      defaultCountry {
        code
        country
      }
    }
  }
`;

export const PRODUCT_UPDATED_SUBSCRIPTION = gql`
  subscription {
    event {
      ... on ProductUpdated {
        product {
          id
          name
          channel
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_SLUG = gql`
  ${PRODUCT_INDEX_FRAGMENT}
  query GetProductBySlug($id: ID!, $channel: String!) {
    product(id: $id, channel: $channel) {
      ...ProductIndexData
    }
  }
`;
