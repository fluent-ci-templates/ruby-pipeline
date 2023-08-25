import Client from "@dagger.io/dagger";
import { withDevbox } from "https://deno.land/x/nix_installer_pipeline@v0.3.6/src/dagger/steps.ts";

export enum Job {
  rubocop = "rubocop",
  rails = "rails",
  rspec = "rspec",
}

export const rubocop = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const baseCtr = withDevbox(
    client
      .pipeline(Job.rubocop)
      .container()
      .from("alpine:latest")
      .withExec(["apk", "update"])
      .withExec(["apk", "add", "bash", "curl"])
      .withMountedCache("/nix", client.cacheVolume("nix"))
      .withMountedCache("/etc/nix", client.cacheVolume("nix-etc"))
  );

  const ctr = baseCtr
    .withMountedCache("/app/vendor", client.cacheVolume("bundle-cache"))
    .withDirectory("/app", context, {
      exclude: ["vendor", ".git", ".devbox", ".fluentci"],
    })
    .withWorkdir("/app")
    .withExec(["sh", "-c", "devbox run -- ruby --version"])
    .withExec([
      "sh",
      "-c",
      "devbox run -- bundle config set --local deployment true",
    ])
    .withExec(["sh", "-c", "devbox run -- bundle install -j $(nproc)"])
    .withExec(["sh", "-c", "devbox run -- bundle exec rubocop"]);

  const result = await ctr.stdout();

  console.log(result);
};

export const rails = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const baseCtr = withDevbox(
    client
      .pipeline(Job.rails)
      .container()
      .from("alpine:latest")
      .withExec(["apk", "update"])
      .withExec(["apk", "add", "bash", "curl"])
      .withMountedCache("/nix", client.cacheVolume("nix"))
      .withMountedCache("/etc/nix", client.cacheVolume("nix-etc"))
  );

  const ctr = baseCtr
    .withMountedCache("/app/vendor", client.cacheVolume("bundle-cache"))
    .withDirectory("/app", context, {
      exclude: ["vendor", ".git", ".devbox", ".fluentci"],
    })
    .withWorkdir("/app")
    .withExec(["sh", "-c", "devbox run -- ruby --version"])
    .withExec([
      "sh",
      "-c",
      "devbox run -- bundle config set --local deployment true",
    ])
    .withExec(["sh", "-c", "devbox run -- bundle install -j $(nproc)"])
    .withExec(["sh", "-c", "devbox run -- bundle exec rails db:migrate"])
    .withExec(["sh", "-c", "devbox run -- bundle exec rails db:seed"])
    .withExec(["sh", "-c", "devbox run -- bundle exec rails test"]);

  const result = await ctr.stdout();

  console.log(result);
};

export const rspec = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const baseCtr = withDevbox(
    client
      .pipeline(Job.rspec)
      .container()
      .from("alpine:latest")
      .withExec(["apk", "update"])
      .withExec(["apk", "add", "bash", "curl"])
      .withMountedCache("/nix", client.cacheVolume("nix"))
      .withMountedCache("/etc/nix", client.cacheVolume("nix-etc"))
  );

  const ctr = baseCtr
    .withMountedCache("/app/vendor", client.cacheVolume("bundle-cache"))
    .withDirectory("/app", context, {
      exclude: ["vendor", ".git", ".devbox", ".fluentci"],
    })
    .withWorkdir("/app")
    .withExec(["sh", "-c", "devbox run -- ruby --version"])
    .withExec([
      "sh",
      "-c",
      "devbox run -- bundle config set --local deployment true",
    ])
    .withExec(["sh", "-c", "devbox run -- gem install rspec"])
    .withExec(["sh", "-c", "devbox run -- bundle install -j $(nproc)"])
    .withExec(["sh", "-c", "devbox run -- rspec spec"]);

  const result = await ctr.stdout();

  console.log(result);
};

export type JobExec = (client: Client, src?: string) => Promise<void>;

export const runnableJobs: Record<Job, JobExec> = {
  [Job.rubocop]: rubocop,
  [Job.rails]: rails,
  [Job.rspec]: rspec,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.rubocop]: "Run rubocop",
  [Job.rails]: "Run rails tests",
  [Job.rspec]: "Run rspec tests",
};
