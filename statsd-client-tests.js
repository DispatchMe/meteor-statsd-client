Tinytest.add('StatsD - generate message', function (test) {
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

Tinytest.add('StatsD - network', function (test) {
  var client = new StatsD('bogus.host', 8125, 'testing', true);
  // Just make sure we get an error when trying to connect to a bogus host.
  test.throws(function () {
    client.count('foo.bar', 10);
  });

});
