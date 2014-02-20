VWF-Web
=======

Public website of the [Virtual World Framework](https://virtual.wf) project.

## Getting Started

```
gem install bundler
bundle install
bundle exec jekyll serve --watch
```

That will start the server on port 4000 and set jekyll to regenerate files when they change.

See the jekyll docs for more information: http://jekyllrb.com.

## Deployment

For the first deploy:

```
bundle exec cap deploy:setup
```

For subsequent deploys:

```
bundle exec cap deploy
```

