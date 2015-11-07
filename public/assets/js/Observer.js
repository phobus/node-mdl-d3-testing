function Observer(sender) {
  this._sender = sender;
  this._listeners = [];
}

Observer.prototype = {
  attach: function(listener) {
    this._listeners.push(listener);
  },
  notify: function(args) {
    var index, l = this._listeners.length;

    for (index = 0; index < l; index += 1) {
      this._listeners[index](this._sender, args);
    }
  }
};
