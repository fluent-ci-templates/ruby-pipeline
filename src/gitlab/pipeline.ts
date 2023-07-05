import { GitlabCI } from "https://deno.land/x/fluent_gitlab_ci@v0.3.2/mod.ts";
import { deploy, rails, rspec, rubocop } from "./jobs.ts";

const gitlabci = new GitlabCI()
  .addJob("rubocop", rubocop)
  .addJob("rails", rails)
  .addJob("rspec", rspec)
  .addJob("deploy", deploy);

export default gitlabci;
