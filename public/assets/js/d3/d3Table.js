function d3Table(config) {
  var columns = config.columns || {};

  var CssClasses = {
    //TABLA
    TABLE: 'mdl-data-table',
    TABLE_JS: 'mdl-js-data-table',
    SELECTABLE: 'mdl-data-table--selectable',

    //CELDA
    NO_NUMERIC: 'mdl-data-table__cell--non-numeric'
  };

  function my(selection) {
    selection.each(function(d, i) {
      if (i >= config.data.length) {
        return;
      }

      d3.select(this).select('.mdl-card__title-text').text(config.data[i].key);

      var table = d3.select(this).select('.mdl-card__data-table').append('table');
      var thead = table.append('thead');
      var tbody = table.append('tbody');

      table.classed(CssClasses.TABLE, config.styles);
      table.classed(CssClasses.TABLE_JS, config.styles);
      table.classed(CssClasses.SELECTABLE, config.styles && config.selectable);

      thead.append('tr')
        .selectAll('th')
        .data(config.columns)
        .enter()
        .append('th')
        .text(function(d, i) {
          return d.alias;
        })
        .classed(CssClasses.NO_NUMERIC, function(d) {
          return d.format == 'no-numeric' && config.styles;
        });

      var rows = tbody.selectAll('tr')
        .data(config.data[i].values)
        .enter()
        .append('tr');

      var cells = rows.selectAll("td")
        .data(function(row) {
          return columns.map(function(column) {
            return row[column.name];
          });
        })
        .enter()
        .append("td")
        .text(function(d) {
          return d;
        })
        .classed(CssClasses.NO_NUMERIC, function(d, i) {
          return columns[i].format == 'no-numeric' && config.styles;
        });
    });
  }

  my.columns = function(value) {
    if (!arguments.length) return columns;
    columns = value;
    return my;
  };

  return my;
}
