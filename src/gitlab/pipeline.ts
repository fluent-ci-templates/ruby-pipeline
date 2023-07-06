import { GitlabCI } from "https://deno.land/x/fluent_gitlab_ci@v0.3.2/mod.ts";
import { herokuDeploy, rails, rspec, rubocop } from "./jobs.ts";

const gitlabci = new GitlabCI()
  .image("ruby:latest")
  .services(["mysql:latest", "redis:latest", "postgres:latest"])
  .variables({
    POSTGRES_DB: "database_name",
  })
  .cache(["vendor/ruby"])
  .beforeScript(
    `
  ruby -v
  bundle config set --local deployment true 
  bundle install -j $(nproc)
`
  )
  .addJob("rubocop", rubocop)
  .addJob("rails", rails)
  .addJob("rspec", rspec)
  .addJob("heroku_deploy", herokuDeploy);

export default gitlabci;
