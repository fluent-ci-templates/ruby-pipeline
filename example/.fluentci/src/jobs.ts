/**
 * @module ruby
 * @description This module provides a set of functions to run ruby related tasks
 */

import { dag, type Directory } from "../sdk/client.gen.ts";
import { getDirectory } from "./helpers.ts";

export enum Job {
  rubocop = "rubocop",
  rails = "rails",
  rspec = "rspec",
  bundleExec = "bundleExec",
}

export const exclude = ["vendor", ".git", ".devbox", ".fluentci"];

/**
 * Run rubocop
 *
 * @function
 * @description Run rubocop
 * @param {string | Directory} src
 * @returns {Promise<string>}
 */
export async function rubocop(
  src: Directory | string | undefined = "."
): Promise<string> {
  const context = await getDirectory(src);
  const baseCtr = dag
    .pipeline(Job.rubocop)
    .container()
    .from("ghcr.io/fluentci-io/devbox:latest")
    .withExec(["sh", "-c", "which nix"])
    .withExec(["sh", "-c", "nix --version"]);
  const ctr = baseCtr
    .withMountedCache("/app/vendor", dag.cacheVolume("bundle-cache"))
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

  return ctr.stdout();
}

/**
 * Run rails tests
 *
 * @function
 * @description Run rails tests
 * @param {string | Directory} src
 * @returns {Promise<string>}
 */
export async function rails(
  src: Directory | string | undefined = "."
): Promise<string> {
  const context = await getDirectory(src);
  const baseCtr = dag
    .pipeline(Job.rails)
    .container()
    .from("ghcr.io/fluent-ci-templates/devbox:latest");

  const ctr = baseCtr
    .withMountedCache("/app/vendor", dag.cacheVolume("bundle-cache"))
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

  return ctr.stdout();
}

/**
 * Run rspec tests
 *
 * @function
 * @description Run rspec tests
 * @param {string | Directory} src
 * @param {string} dir directory that contains the tests
 * @returns {Promise<string>}
 */
export async function rspec(
  src: Directory | string | undefined = ".",
  dir: string = "spec"
): Promise<string> {
  const context = await getDirectory(src);
  const baseCtr = dag
    .pipeline(Job.rspec)
    .container()
    .from("ghcr.io/fluent-ci-templates/devbox:latest");

  const ctr = baseCtr
    .withMountedCache("/app/vendor", dag.cacheVolume("bundle-cache"))
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
    .withExec(["sh", "-c", "devbox run -- rspec", dir]);

  return ctr.stdout();
}

/**
 * Run bundle exec
 *
 * @function
 * @description Run bundle exec
 * @param {string | Directory} src
 * @param {string} task task to run
 * @returns {Promise<string>}
 */
export async function bundleExec(
  src: Directory | string | undefined = ".",
  task: string = "rake"
): Promise<string> {
  const context = await getDirectory(src);
  const baseCtr = dag
    .pipeline(Job.rspec)
    .container()
    .from("ghcr.io/fluent-ci-templates/devbox:latest");

  const ctr = baseCtr
    .withMountedCache("/app/vendor", dag.cacheVolume("bundle-cache"))
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(["sh", "-c", "devbox run -- ruby --version"])
    .withExec([
      "sh",
      "-c",
      "devbox run -- bundle config set --local deployment true",
    ])
    .withExec(["sh", "-c", "devbox run -- bundle install -j $(nproc)"])
    .withExec(["sh", "-c", "devbox run -- bundle exec", task]);

  return ctr.stdout();
}

export type JobExec =
  | ((src?: Directory | string) => Promise<string>)
  | ((src?: Directory | string, dir?: string) => Promise<string>)
  | ((src?: Directory | string, task?: string) => Promise<string>);

export const runnableJobs: Record<Job, JobExec> = {
  [Job.rubocop]: rubocop,
  [Job.rails]: rails,
  [Job.rspec]: rspec,
  [Job.bundleExec]: bundleExec,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.rubocop]: "Run rubocop",
  [Job.rails]: "Run rails tests",
  [Job.rspec]: "Run rspec tests",
  [Job.bundleExec]: "Run bundle exec",
};
