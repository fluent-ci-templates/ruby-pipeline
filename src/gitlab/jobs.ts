import { Job } from "https://deno.land/x/fluent_gitlab_ci@v0.3.2/mod.ts";

export const rubocop = new Job().script("rubocop");

export const rails = new Job().variables({
  DATABASE_URL: "postgresql://postgres:postgres@postgres:5432/$POSTGRES_DB",
}).script(`
    rails db:migrate
    rails db:seed
    rails test
  `);

export const rspec = new Job().script("rspec spec");

export const deploy = new Job().stage("deploy").environment("production")
  .script(`
      gem install dpl
      dpl --provider=heroku --app=$HEROKU_APP_NAME --api-key=$HEROKU_PRODUCTION_KEY
    `);
