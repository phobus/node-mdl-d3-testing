(function(window, document, scope, undefined) {

  var d3 = window.d3;

  var model = {
    init: function() {
      this.dataLoaded = new Observer(this);

      this.itemAdded = new Observer(this);
      this.itemRemoved = new Observer(this);

      this._items = [];
      this._date;

      this.url = 'data.json';

    },
    setDate: function(date) {
      this._date = date;
      this.load();
    },
    getItems: function() {
      return [].concat(this._items);
    },
    addItem: function(item) {
      this._items.push(item);
      this.itemAdded.notify({
        item: item
      });
    },
    removeItem: function(item) {
      var l = this._items.length;
      for (var i = 0; i < l; i++) {
        if (this._items[i][0] === item[0] && this._items[i][1] === item[1]) {
          this._items.splice(i, 1);
          this.itemRemoved.notify({
            item: item
          });
          break;
        }
      }
    },
    load: function() {
      d3.json(this.url, this.dataAdapter.bind(this))
    },
    dataAdapter: function(error, data) {
      var _this = this;
      var dataByDate = d3.nest()
        .key(function(d) {
          return d.date;
        })
        .entries(data.data);

      var dataFilter = dataByDate.filter(function(d) {
        return d.key == _this._date;
      });

      var model = d3.nest()
        .key(function(d) {
          return d.gr_name;
        })
        .entries(dataFilter[0].values);

      this.dataLoaded.notify({
        key: _this._date,
        values: model
      });
    }
  };

  var view = {
    init: function(model, elements) {
      this.model = model;
      this._elements = elements;

      var _this = this;
      this.model.dataLoaded.attach(function(sender, args) {
        _this.render(sender, args);
      });

      this.rowChanged = new Observer(this);
    },
    render: function(sender, args) {
      var t = d3Table({
        data: args.values,
        styles: true,
        selectable: true,
        columns: [{
          name: 'title',
          alias: 'Titulo',
          format: 'no-numeric'
        }, {
          name: 'col1',
          alias: 'col 1'
        }, {
          name: 'col2',
          alias: 'col 2'
        }, {
          name: 'col3',
          alias: 'col 3'
        }, {
          name: 'col4',
          alias: 'col 4'
        }]
      });
      d3.selectAll('.mdl-card-report').call(t);
      d3.selectAll('#mdl-card__title-date').text(args.key);
      componentHandler.upgradeDom();

      /*d3.selectAll('.report .mdl-checkbox__input').on('change', function(e) {
        console.log(e);
      });*/

      var inputs = document.querySelectorAll('.mdl-card-report .mdl-checkbox__input'),
        l = inputs.length;
      for (var i = 0; i < l; i++) {
        inputs[i].addEventListener('change', this.onChangeRow.bind(this))
      }
    },
    onChangeRow: function(event) {
      var row = event.target.parentNode.parentNode.parentNode;
      var checked = row.classList.contains('is-selected');

      this.rowChanged.notify({
        //event: event,
        //row: row,
        checked: checked,
        data: row.__data__
      });
      //console.log(checked, row, row.__data__);
    }
  };

  var controller = {
    init: function(model, view) {
      this.model = model;
      this.view = view;

      var _this = this;
      this.view.rowChanged.attach(function(sender, args) {
        if (args.checked) {
          _this.model.addItem([args.data.id_gr, args.data.id_ln]);
        } else {
          _this.model.removeItem([args.data.id_gr, args.data.id_ln]);
        }
      });
    }
  };

  scope['report'] = {
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
