import Client, { connect } from "@dagger.io/dagger";
import { herokuDeploy, rails, rspec, rubocop } from "./jobs.ts";

export default function pipeline(src = ".") {
  connect(async (client: Client) => {
    await rubocop(client, src);
    await rails(client, src);
    await rspec(client, src);
    await herokuDeploy(client, src);
  });
}
