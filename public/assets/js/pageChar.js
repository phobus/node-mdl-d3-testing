(function(window, document, scope, undefined) {

  var d3 = window.d3;

  var config = {
    grouping: 'title',
    columns: {
      x: {
        name: 'date',
        alias: 'Date'
      },
      y: {
        name: 'col1',
        alias: 'col 1'
      }
    }
  };

  var model = {
    init: function() {
      this.dataLoaded = new Observer(this);

      this.url = 'data.json';
    },
    load: function() {
      d3.json(this.url, this.dataAdapter.bind(this))
    },
    dataAdapter: function(error, data) {
      var model = d3.nest()
        .key(function(d) {
          return d[config.grouping];
        })
        .entries(data.data);

      this.dataLoaded.notify(model);
    }
  };

  var view = {
    init: function(model) {
      this.model = model;

      var _this = this;
      this.model.dataLoaded.attach(function(sender, args) {
        _this.render(sender, args);
      });
    },
    render: function(sender, args) {
      var char = d3CharBrush(config, [args[0], args[10], args[15]]);
      d3.selectAll('.mdl-card-char').call(char);
    }
  };

  var controller = {
    init: function(model, view) {
      this.model = model;
      this.view = view;

      var _this = this;
    }
  };

  scope['char'] = {
    init: function() {
      model.init();
      view.init(model);
      controller.init(model, view);
    },
    model: model,
    view: view,
    controller: controller
  };

})(window, document, window.page = window.page || {});
