Timer = function(name, client) {
	this._name = name;
	this._elapsed = 0;
	this._client = client;
};

Timer.prototype.start = function() {
	this._startTime = Date.now();
};

Timer.prototype.stop = function() {
	this._elapsed = Date.now() - this._startTime;
	return this._client.timer(this._name, this._elapsed, 'ms');
};
