import { GitlabCI } from "https://deno.land/x/fluent_gitlab_ci@v0.3.2/mod.ts";
import { rubocop } from "./jobs.ts";

const gitlabci = new GitlabCI()
  .addJob("rubocop", rubocop)
  .addJob("rails", rubocop)
  .addJob("rspec", rubocop)
  .addJob("deploy", rubocop);

export default gitlabci;
