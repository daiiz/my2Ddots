const $ = require('jquery');
const groupList = [
  "red", "blue", "green", "yellow", "cyan", "purple", "gray"
];

var bindEvents = () => {
  var $canvas = $('div#canvas');
  var $select = $('#class-list');
  
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
  $point.css({
    'top': y,
    'left': x,
    'background-color': groupList[groupNumber]
  });
  $point.attr('data-group', groupNumber);
  $canvas.append($point);
};

$(function () {
  initTools();
  bindEvents();
});