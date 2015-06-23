A bare-bones StatsD client for Meteor.

# Instantiating
Create a new client as follows (port is usually 8125):

```javascript
var client = new StatsD('statsd.host.com', 8125, 'myPrefix');
```

Note that the UDP socket is lazy-loaded, but you can explicitly open and close it using `client._openSocket()` and `client.closeSocket()`. `_openSocket()` is "private" because it is called internally when the first metric is tracked.

# Usage
See https://github.com/etsy/statsd/blob/master/docs/metric_types.md for information on metric types.

## Counts
Default data type is a count. So all you have to do is run `client.track('metricName', 10);`, or use the `count` courtesy function: `client.count('metricName', 10);`

## Gauges
To change the type, just provide the third argument to `client.track`, like so:

```javascript
client.track('gaugeName', 15, {
	type:'gauge'
});
```

Or use the `gauge` courtesy function: `client.gauge('gaugeName', 10);`

## Timers
Use the same syntax as gauge, (but set `type` to `"gauge"`, obviously), and also provide the `timingInterval` if you want it to be something other than `'ms'`:

```javascript
client.track('timerName', 320, {
	type:'timer',
	timingInterval:'s'
});
```

Or use the `timer` courtesy function: `client.timer('timerName', 320, 's');`

## Other options
You can specify the `samplePercentage`, which StatsD uses to determine which percentage of metrics will actually make it to Graphite. Just set `samplePercentage` in the options (third) argument to `client.track`.

# Debugging
When you instantiate a new client, the fourth argument is `debug`. If `true`, tracking will happen inside of a fiber so you will be able to see any errors. Note that this is inherently slower if you're running synchronous code because it will need to wait for the packet to be sent. However, since this is UDP, the slowdown will likely be unnoticeable.
