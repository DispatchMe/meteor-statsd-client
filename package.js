Package.describe({
  name: 'dispatch:statsd-client',
  version: '0.1.0',
  // Brief, one-line summary of the package.
  summary: 'A bare-bones StatsD client for meteor',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/DispatchMe/meteor-statsd-client',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.use(['underscore', 'check'], 'server');
  api.versionsFrom('1.1.0.2');
  api.addFiles(['client.js', 'timer.js', 'instance.js', 'utils.js'], 'server');
  api.export('StatsD', 'server');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use(['dispatch:statsd-client', 'practicalmeteor:sinon'], 'server');
  api.addFiles('tests.js', 'server');
});
