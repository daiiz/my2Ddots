const $ = require('jquery');
const groupList = [
  "red", "blue", "green", "yellow", "cyan", "purple", "gray"
];

var bindEvents = () => {
  var $canvas = $('div#canvas');
  var $select = $('#class-list');
  var $loadBtn = $('#load-csv');
  var $range = $('#range');
  
  // remove dot
  $canvas.on('click', '.point', e => {
    var $dot = $(e.target).closest('.point');
    $dot.remove();
    return false;
  });

  // plot dot
  $canvas.on('click', e => {
    var t = e.target;
    var clientRect = t.getBoundingClientRect() ;
    var posX = clientRect.left + window.pageXOffset;
    var posY = clientRect.top + window.pageYOffset;

    // detect position
    var x = Math.max(0, e.pageX - Math.floor(posX));
    var y = Math.max(0, e.pageY - Math.floor(posY));
    // detect group
    var groupNumber = $select.val();
    plotDot(x, y, groupNumber);
  });

  // Ctrl+z, Cmd+z
  // remove latest dot
  $(window).on('keydown', e => {
    var Z = 90;
    if ((e.keyCode === Z) && (e.ctrlKey || e.metaKey)) {
      var dots = $('div.point');
      $(dots[dots.length - 1]).remove();
    }
  });

  // load well-formatted CSV (or TSV)
  $loadBtn.on('change', e => {
    if (e.target.files.length === 0) return;
    clearCanvas();
    var separator = ',';
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = (f => {
      var data = f.target.result.replace('\r', '');
      var records = data.split('\n');

      // x, y, label
      var maxNum = -1000000;
      var minNum = +1000000;
      var points = [];
      records.forEach(record => {
        if (record.indexOf(separator) === -1) separator = '\t';
        var [x, y, label] = record.split(separator);
        if (!x || !y) return;
        if (!label) label = 0;
        // negative label -1 -> 0
        label = Math.max(0, +label);
        x = +x;
        y = +y;
        if (maxNum < x) maxNum = x;
        if (maxNum < y) maxNum = y;
        if (minNum > x) minNum = x;
        if (minNum > y) minNum = y;
        points.push([x, y, label]);
      });
      
      var range = Math.floor(Math.max(Math.abs(maxNum), Math.abs(minNum))) + 1;
      $range.val(range);
      points = translation(points, range, true, '+');

      // plot scaled dots
      points.forEach(point => {
        plotDot(point[0], point[1], point[2]);
      });
    });
    reader.readAsText(file);
  });
};

var translation = (points=[], range=10, scale=true, direction='+') => {
  var $canvas = $('div#canvas');
  var w = Math.floor($canvas[0].offsetWidth)// / 2);
  var scaled = [];
  for (var i = 0; i < points.length; i++) {
    var point = points[i];
    var s = [];
    var c = w / (2 * range);
    if (!scale) scale = 1.0;
    var x = point[0];
    var y = point[1];
    console.log(w, c);
    if (direction === '+') {
      // import
      s.push((x + range) * c - 4);
      //s.push((x * c) + w/2);
      s.push((range - y) * c - 4);
      // s.push(x * c + w/2);
      // if (y <= 0) {
      //   s.push(Math.abs(y) * c + w);
      // } else {
      //   s.push(w - y * c);
      // }
    } else {
      // export
      s.push(point[0] * c - w);
      s.push(point[1] * c - w);
    }
    
    s.push(point[2]); // label
    scaled.push(s);
  }
  return scaled;
};

var initTools = () => {
  var $select = $('#class-list');
  var idx = 0;
  groupList.forEach(cl => {
    var $opt = $(`<option value="${idx}">${cl} (${idx})</option>`);
    $select.append($opt);
    idx += 1;
  })
};

var plotDot = (x, y, groupNumber) => {
  var $canvas = $('div#canvas');
  var $point = $(`<div class="point"></div>`);
  var posId = `pos_${x}_${y}`.replace(/\./gi, '-');
  if ($(`div.point[data-pos=${posId}]`).length > 0) return;
  $point.css({
    'top': y,
    'left': x,
    'background-color': groupList[groupNumber]
  });
  $point.attr('data-group', groupNumber);
  $point.attr('data-pos', posId);
  $canvas.append($point);
};

var clearCanvas = () => {
  $('.point').remove();
};

$(function () {
  initTools();
  bindEvents();
});