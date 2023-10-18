import { gql } from "../../deps.ts";

export const rubocop = gql`
  query rubcop($src: String!) {
    rubocop(src: $src)
  }
`;

export const rails = gql`
  query rails($src: String!) {
    rails(src: $src)
  }
`;

export const rspec = gql`
  query rspec($src: String!) {
    rspec(src: $src)
  }
`;
