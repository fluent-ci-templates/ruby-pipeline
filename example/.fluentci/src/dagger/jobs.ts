import Client, { connect } from "../../deps.ts";

export enum Job {
  rubocop = "rubocop",
  rails = "rails",
  rspec = "rspec",
}

export const exclude = ["vendor", ".git", ".devbox", ".fluentci"];

export const rubocop = async (src = ".") => {
  await connect(async (client: Client) => {
    const context = client.host().directory(src);
    const baseCtr = client
      .pipeline(Job.rubocop)
      .container()
      .from("ghcr.io/fluent-ci-templates/devbox:latest")
      .withExec(["mv", "/nix/store", "/nix/store-orig"])
      .withMountedCache("/nix/store", client.cacheVolume("nix-cache"))
      .withExec(["sh", "-c", "cp -r /nix/store-orig/* /nix/store/"])
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
};

export const rails = async (src = ".") => {
  await connect(async (client: Client) => {
    const context = client.host().directory(src);
    const baseCtr = client
      .pipeline(Job.rails)
      .container()
      .from("ghcr.io/fluent-ci-templates/devbox:latest")
      .withExec(["mv", "/nix/store", "/nix/store-orig"])
      .withMountedCache("/nix/store", client.cacheVolume("nix-cache"))
      .withExec([
        "sh",
        "-c",
        'cp -r /nix/store-orig/* /nix/store/ && eval "$(devbox global shellenv)"',
      ])
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
      .withExec(["sh", "-c", "ls -ltr /nix"])
      .withExec(["sh", "-c", "ls -ltr /nix/store"])
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
};

export const rspec = async (src = ".") => {
  await connect(async (client: Client) => {
    const context = client.host().directory(src);
    const baseCtr = client
      .pipeline(Job.rspec)
      .container()
      .from("ghcr.io/fluent-ci-templates/devbox:latest")
      .withExec(["mv", "/nix/store", "/nix/store-orig"])
      .withMountedCache("/nix/store", client.cacheVolume("nix-cache"))
      .withExec(["sh", "-c", "cp -r /nix/store-orig/* /nix/store/"])
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
};

export type JobExec = (src?: string) => Promise<string>;

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
