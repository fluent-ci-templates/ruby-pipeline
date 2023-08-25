# Ruby Pipeline

[![deno module](https://shield.deno.dev/x/ruby_pipeline)](https://deno.land/x/ruby_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.34)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/ruby-pipeline)](https://codecov.io/gh/fluent-ci-templates/ruby-pipeline)

A ready-to-use CI/CD Pipeline for Ruby projects.

## 🚀 Usage

Run the following command in your project:

```bash
dagger run fluentci ruby_pipeline
```

Or, if you want to use it as a template:

```bash
fluentci init -t ruby
```

This will create a `.fluentci` folder in your project.

Now you can run the pipeline with:

```bash
dagger run fluentci .
```

## Jobs

| Job           | Description       |
| ------------- | ----------------- |
| rubocop       | Runs Rubocop      |
| rails         | Runs Rails tests  |
| rspec         | Runs RSpec tests  |

## Programmatic usage

You can also use this pipeline programmatically:

```ts
import { Client, connect } from "https://esm.sh/@dagger.io/dagger@0.8.1";
import { Dagger } from "https://deno.land/x/ruby_pipeline/mod.ts";

const { rubocop, rails, rspec } = Dagger;

function pipeline(src = ".") {
  connect(async (client: Client) => {
    await rubocop(client, src);
    await rails(client, src);
    await rspec(client, src);
  });
}

pipeline();
```
