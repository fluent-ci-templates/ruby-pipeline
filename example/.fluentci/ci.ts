import {
  rubocop,
  rails,
  rspec,
} from "https://pkg.fluentci.io/ruby_pipeline@v0.7.1/mod.ts";

await rubocop();
await rails();
await rspec();
