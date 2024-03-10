import { rubocop, rails, rspec } from "jsr:@fluentci/ruby";

await rubocop();
await rails();
await rspec();
