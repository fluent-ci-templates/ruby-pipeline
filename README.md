# Ruby Pipeline

[![fluentci pipeline](https://img.shields.io/badge/dynamic/json?label=pkg.fluentci.io&labelColor=%23000&color=%23460cf1&url=https%3A%2F%2Fapi.fluentci.io%2Fv1%2Fpipeline%2Fruby_pipeline&query=%24.version)](https://pkg.fluentci.io/ruby_pipeline)
[![deno module](https://shield.deno.dev/x/ruby_pipeline)](https://deno.land/x/ruby_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.34)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/ruby-pipeline)](https://codecov.io/gh/fluent-ci-templates/ruby-pipeline)

A ready-to-use CI/CD Pipeline for Ruby projects.

## 🚀 Usage

Run the following command in your project:

```bash
fluentci run ruby_pipeline
```

Or, if you want to use it as a template:

```bash
fluentci init -t ruby
```

This will create a `.fluentci` folder in your project.

Now you can run the pipeline with:

```bash
fluentci run .
```

## Dagger Module

Use as a [Dagger](https://dagger.io) module:

```bash
dagger mod install github.com/fluent-ci-templates/ruby-pipeline@mod
```

## Jobs

| Job           | Description       |
| ------------- | ----------------- |
| rubocop       | Runs Rubocop      |
| rails         | Runs Rails tests  |
| rspec         | Runs RSpec tests  |

```typescript
rails(
  src: Directory | string
): Promise<string>

rspec(
  src: Directory | string
): Promise<string>

rubocop(
  src: Directory | string
): Promise<string>
```

## Programmatic usage

You can also use this pipeline programmatically:

```ts
import { rubocop, rails, rspec } from "https://pkg.fluentci.io/ruby_pipeline@v0.8.0/mod.ts";

await rubocop();
await rails();
await rspec();
```
