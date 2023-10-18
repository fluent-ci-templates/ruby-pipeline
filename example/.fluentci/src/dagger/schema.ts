import {
  queryType,
  makeSchema,
  dirname,
  join,
  resolve,
  stringArg,
  nonNull,
} from "../../deps.ts";

import { rubocop, rails, rspec } from "./jobs.ts";

const Query = queryType({
  definition(t) {
    t.string("rubocop", {
      args: {
        src: nonNull(stringArg()),
      },
      resolve: async (_root, args, _ctx) => await rubocop(args.src),
    });
    t.string("rspec", {
      args: {
        src: nonNull(stringArg()),
      },
      resolve: async (_root, args, _ctx) => await rspec(args.src),
    });
    t.string("rails", {
      args: {
        src: nonNull(stringArg()),
      },
      resolve: async (_root, args, _ctx) => await rails(args.src),
    });
  },
});

export const schema = makeSchema({
  types: [Query],
  outputs: {
    schema: resolve(join(dirname(".."), dirname(".."), "schema.graphql")),
    typegen: resolve(join(dirname(".."), dirname(".."), "gen", "nexus.ts")),
  },
});
