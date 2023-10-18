import Client, { connect } from "https://sdk.fluentci.io/v0.1.9/mod.ts";
import {
  rubocop,
  rails,
  rspec,
} from "https://pkg.fluentci.io/ruby_pipeline@v0.6.5/mod.ts";

function pipeline(src = ".") {
  connect(async (client: Client) => {
    await rubocop(client, src);
    await rails(client, src);
    await rspec(client, src);
  });
}

pipeline();
