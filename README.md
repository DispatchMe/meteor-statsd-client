A bare-bones StatsD client for Meteor.

# Instantiating
A client will automatically be created for you if you have the following settings in `Meteor.settings`:

```json
{
	"statsd":{
		"host":"statsd.myserver.com",
		"port":8125
		"prefix":"myMetricPrefix"
	}
}
```

All of the methods on this "default" client will be attached to the exported `StatsD` object, so you can call functions like `StatsD.count(...)` and it will call `count()` on the default client.

Alternatively, you can create a new client as follows (port is usually 8125):

```javascript
var client = new StatsD('statsd.host.com', 8125, 'myPrefix');
```

Note that the UDP socket is lazy-loaded, but you can explicitly open and close it using `client._openSocket()` and `client.closeSocket()`. `_openSocket()` is "private" because it is called internally when the first metric is tracked.

# Usage
See https://github.com/etsy/statsd/blob/master/docs/metric_types.md for information on metric types.

## Counts
Default data type is a count. So all you have to do is run `StatsD.track('metricName', 10);`, or use the `count` courtesy function: `StatsD.count('metricName', 10);`

## Gauges
To change the type, just provide the third argument to `client.track`, like so:

```javascript
StatsD.track('gaugeName', 15, {
	type:'gauge'
});
```

Or use the `gauge` courtesy function: `client.gauge('gaugeName', 10);`

## Timers
You can track time in two different ways. One, time the processes yourself, and use `client.timer('timerName', elapsed, 'interval')`, e.g. `client.timer('myTimer', 20, 'ms');`. Or, you can use the built-in timer:

```javascript
// This will go into StatsD as key some.timer.value
var myTimer = StatsD.startTimer('some.timer.value');
// Do something that takes a while...
myTimer.stop();
```

The above will automatically send the elapsed time to StatsD when you run `myTimer.stop();`

## Other options
You can specify the `samplePercentage`, which StatsD uses to determine which percentage of metrics will actually make it to Graphite. Just set `samplePercentage` in the options (third) argument to `client.track`.

# Debugging
When you instantiate a new client, the fourth argument is `debug`. If `true`, tracking will happen inside of a fiber so you will be able to see any errors. Note that this is inherently slower if you're running synchronous code because it will need to wait for the packet to be sent. However, since this is UDP, the slowdown will likely be unnoticeable.

# Function Wrapping
You can use `StatsD.monitorFunction` to wrap any function and send metrics to `statsd`. If the function throws an error, the count for `{metricName}.error` will be incremented by 1, and if not, the count for `{metricName}.success` will be incremented by 1. For example:

```javascript
Meteor.methods({
	'myMethod':StatsD.monitorFunction('myMetric', function(data) {
		// Do something with the data
	}, {
		trackSuccess:true,
		trackCalls:true
	})
});
```

In this case, every time you run `Meteor.call('myMethod')`, `myMetric.call` will be incremented by 1. If the function returns successfully, then `myMetric.success` will be incremented, otherwise if there's an error thrown, `myMetric.error` will be incremented.
