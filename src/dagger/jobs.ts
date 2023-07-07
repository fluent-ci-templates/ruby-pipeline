import Client from "@dagger.io/dagger";

export const rubocop = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const ctr = client
    .pipeline("rubocop")
    .container()
    .from("ruby:latest")
    .withDirectory("/app", context, { exclude: ["vendor"] })
    .withWorkdir("/app")
    .withExec(["ruby", "-v"])
    .withExec(["bundle", "config", "set", "--local", "deployment", "true"])
    .withExec(["bundle", "install", "-j", "$(nproc)"])
    .withExec(["rubocop"]);

  const result = await ctr.stdout();

  console.log(result);
};

export const rails = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const ctr = client
    .pipeline("rails")
    .container()
    .from("ruby:latest")
    .withDirectory("/app", context, { exclude: ["vendor"] })
    .withWorkdir("/app")
    .withExec(["ruby", "-v"])
    .withExec(["bundle", "config", "set", "--local", "deployment", "true"])
    .withExec(["bundle", "install", "-j", "$(nproc)"])
    .withExec(["rails", "db:migrate"])
    .withExec(["rails", "db:seed"])
    .withExec(["rails", "test"]);

  const result = await ctr.stdout();

  console.log(result);
};

export const rspec = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const ctr = client
    .pipeline("rspec")
    .container()
    .from("ruby:latest")
    .withDirectory("/app", context, { exclude: ["vendor"] })
    .withWorkdir("/app")
    .withExec(["ruby", "-v"])
    .withExec(["bundle", "config", "set", "--local", "deployment", "true"])
    .withExec(["bundle", "install", "-j", "$(nproc)"])
    .withExec(["rspec", "spec"]);

  const result = await ctr.stdout();

  console.log(result);
};

export const herokuDeploy = async (client: Client, src = ".") => {
  const HEROKU_APP_NAME = Deno.env.get("HEROKU_APP_NAME");
  const HEROKU_PRODUCTION_KEY = Deno.env.get("HEROKU_PRODUCTION_KEY");

  if (!HEROKU_APP_NAME || !HEROKU_PRODUCTION_KEY) {
    throw new Error("HEROKU_APP_NAME or HEROKU_PRODUCTION_KEY not found");
  }

  const context = client.host().directory(src);
  const ctr = client
    .pipeline("heroku_deploy")
    .container()
    .from("ruby:latest")
    .withDirectory("/app", context, { exclude: ["vendor"] })
    .withWorkdir("/app")
    .withExec(["ruby", "-v"])
    .withExec(["bundle", "config", "set", "--local", "deployment", "true"])
    .withExec(["bundle", "install", "-j", "$(nproc)"])
    .withExec(["gem", "install", "dpl"])
    .withExec([
      "dpl",
      "--provider=heroku",
      `--app=${HEROKU_APP_NAME}`,
      `--api-key=${HEROKU_PRODUCTION_KEY}`,
    ]);

  const result = await ctr.stdout();

  console.log(result);
};
