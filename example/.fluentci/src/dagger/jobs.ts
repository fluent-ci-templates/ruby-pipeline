import { Client, Directory } from "../../sdk/client.gen.ts";
import { connect } from "../../sdk/connect.ts";
import { getDirectory } from "./lib.ts";

export enum Job {
  rubocop = "rubocop",
  rails = "rails",
  rspec = "rspec",
}

export const exclude = ["vendor", ".git", ".devbox", ".fluentci"];

/**
 * @function
 * @description Run rubocop
 * @param {string | Directory} src
 * @returns {Promise<string>}
 */
export async function rubocop(
  src: Directory | string | undefined = "."
): Promise<string> {
  await connect(async (client: Client) => {
    const context = getDirectory(client, src);
    const baseCtr = client
      .pipeline(Job.rubocop)
      .container()
      .from("ghcr.io/fluentci-io/devbox:latest")
      .withExec(["sh", "-c", "devbox version update"])
      .withExec(["sh", "-c", "which nix"])
      .withExec(["sh", "-c", "nix --version"]);
    const ctr = baseCtr
      .withMountedCache("/app/vendor", client.cacheVolume("bundle-cache"))
      .withDirectory("/app", context, {
        exclude,
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
  });
  return "Done";
}

/**
 * @function
 * @description Run rails tests
 * @param {string | Directory} src
 * @returns {Promise<string>}
 */
export async function rails(
  src: Directory | string | undefined = "."
): Promise<string> {
  await connect(async (client: Client) => {
    const context = getDirectory(client, src);
    const baseCtr = client
      .pipeline(Job.rails)
      .container()
      .from("ghcr.io/fluent-ci-templates/devbox:latest")
      .withExec(["sh", "-c", "devbox version update"]);

    const ctr = baseCtr
      .withMountedCache("/app/vendor", client.cacheVolume("bundle-cache"))
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withExec(["sh", "-c", "devbox run -- ruby --version"])
      .withExec([
        "sh",
        "-c",
        "devbox run -- bundle config set --local deployment true",
      ])
      .withExec(["sh", "-c", "which nix"])
      .withExec(["sh", "-c", "nix --version"])
      .withExec(["sh", "-c", "devbox run -- bundle install -j $(nproc)"])
      .withExec(["sh", "-c", "devbox run -- bundle exec rails db:migrate"])
      .withExec(["sh", "-c", "devbox run -- bundle exec rails db:seed"])
      .withExec(["sh", "-c", "devbox run -- bundle exec rails test"]);

    const result = await ctr.stdout();

    console.log(result);
  });
  return "Done";
}

/**
 * @function
 * @description Run rspec tests
 * @param {string | Directory} src
 * @returns {Promise<string>}
 */
export async function rspec(
  src: Directory | string | undefined = "."
): Promise<string> {
  await connect(async (client: Client) => {
    const context = getDirectory(client, src);
    const baseCtr = client
      .pipeline(Job.rspec)
      .container()
      .from("ghcr.io/fluent-ci-templates/devbox:latest")
      .withExec(["sh", "-c", "devbox version update"]);

    const ctr = baseCtr
      .withMountedCache("/app/vendor", client.cacheVolume("bundle-cache"))
      .withDirectory("/app", context, { exclude })
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
  });
  return "Done";
}

export type JobExec = (src?: Directory | string) => Promise<string>;

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
