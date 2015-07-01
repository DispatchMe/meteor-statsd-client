Tinytest.add('StatsD - UDP packets should be generated with correct formatting', function(test) {
  var client = new StatsD('bogus.host', 8125, 'testing', true);


  test.equal(client._generateMessage('foo.bar', 10).toString(), 'testing.foo.bar:10|c');

  test.equal(client._generateMessage('baz.bing', 15, {
    type: 'gauge',
    samplePercentage: 0.5
  }).toString(), 'testing.baz.bing:15|g|@0.5');

  test.equal(client._generateMessage('boop.scoop', 0.67, {
    type: 'timer',
    timingInterval: 's'
  }).toString(), 'testing.boop.scoop:0.67|s');
});


Tinytest.add('StatsD - Timer should log a metric on stop', function(test) {
  var client = new StatsD('bogus.host', 8125, 'testing', true);
  var stub = stubs.create('timer', client, 'track');
  var socketStub = stubs.create('socket', client, '_openSocket');
  var timer = client.startTimer('foo.bar.baz');
  Meteor._sleepForMs(100);
  timer.stop();

  sinon.assert.calledWith(stubs.timer, 'foo.bar.baz', sinon.match.number, {
    timingInterval: 'ms',
    type: 'timer'
  });
});

Tinytest.add('StatsD - Package should create instance from Meteor.settings.statsd', function(test) {
  // Manually configure...
  Meteor.settings.statsd = {
    host: 'bogus.host',
    port: 8125,
    prefix: 'foo'
  };

  StatsD._loadClient();

  test.isNotNull(StatsD._instance);

  // Reset
  StatsD._instance = null;
});

Tinytest.add('StatsD - _loadClient should throw an error if settings are present but not correct', function(test) {
  Meteor.settings.statsd = {};

  test.throws(StatsD._loadClient);
});

Tinytest.add('StatsD - default instance methods should throw an error if _loadClient failed or was not run', function(test) {
  Meteor.settings.statsd = undefined;
  StatsD._loadClient();
  test.throws(StatsD.count);
  test.throws(StatsD.gauge);
  test.throws(StatsD.timer);
  test.throws(StatsD.startTimer);
  // Reset
  StatsD._instance = null;
});

Tinytest.add('StatsD - monitorFunction should log stats accurately', function(test) {

  var mockHelper = {
    count: StatsD.count
  };

  // We can't mock using sinon because StatsD is a function rather than an object (annoying)
  // Do custom mocks instead.
  var calls = [];
  StatsD.count = function() {
    calls.push(arguments);
  };

  var monitoredFunction = StatsD.monitorFunction('testMetric', function(boolVal) {
    if (!boolVal) {
      throw new Error('Boolval must be true');
    }
  });

  monitoredFunction(true);
  test.equal(calls.length, 1);
  test.equal(calls[0][0], 'testMetric.success');
  test.equal(calls[0][1], 1);

  calls = [];

  test.throws(function() {
    monitoredFunction(false);
  });

  test.equal(calls.length, 1);
  test.equal(calls[0][0], 'testMetric.error');
  test.equal(calls[0][1], 1);

});
