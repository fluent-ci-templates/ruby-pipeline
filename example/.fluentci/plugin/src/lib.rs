use extism_pdk::*;
use fluentci_pdk::dag;

use crate::helpers::setup_devbox;

pub mod helpers;

#[plugin_fn]
pub fn setup() -> FnResult<String> {
    setup_devbox()?;
    let stdout = dag()
        .devbox()?
        .with_exec(vec!["devbox run -- ruby --version"])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn rubocop(args: String) -> FnResult<String> {
    setup_devbox()?;

    let stdout = dag()
        .devbox()?
        .with_exec(vec!["devbox run -- ruby --version"])?
        .with_exec(vec![
            "devbox run -- bundle config set --local deployment true",
        ])?
        .with_exec(vec!["devbox run -- bundle install -j $(nproc)"])?
        .with_exec(vec!["devbox run -- bundle exec rubocop", &args])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn rails_test(args: String) -> FnResult<String> {
    setup_devbox()?;

    let stdout = dag()
        .devbox()?
        .with_exec(vec!["devbox run -- ruby --version"])?
        .with_exec(vec![
            "devbox run -- bundle config set --local deployment true",
        ])?
        .with_exec(vec!["devbox run -- bundle install -j $(nproc)"])?
        .with_exec(vec!["devbox run -- bundle exec rails db:migrate"])?
        .with_exec(vec!["devbox run -- bundle exec rails db:seed"])?
        .with_exec(vec!["devbox run -- bundle exec rails test", &args])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn rspec(args: String) -> FnResult<String> {
    setup_devbox()?;

    let stdout = dag()
        .devbox()?
        .with_exec(vec!["devbox run -- ruby --version"])?
        .with_exec(vec![
            "devbox run -- bundle config set --local deployment true",
        ])?
        .with_exec(vec!["devbox run -- gem install rspec"])?
        .with_exec(vec!["devbox run -- bundle install -j $(nproc)"])?
        .with_exec(vec!["devbox run -- rspec spec", &args])?
        .stdout()?;
    Ok(stdout)
}
