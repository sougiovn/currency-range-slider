
var sliderConfig = {
  labelPrefix: 'R$ ',
  max: 200,
  min: 0,
};

var slider = RangeSlider('my-range', sliderConfig);

var view = document.getElementById('view');

document.getElementById('my-range').addEventListener('rangeChange', function(event) {
  view.innerHTML = ['Min:', event.detail.min, '- Max:', event.detail.max].join(' ');
});

var destroyButton = document.getElementById('destroy-my-range');

destroyButton.addEventListener('click', function() {
  slider.destroy();
});

var setMinValue = document.getElementById('setMinValue-my-range');

setMinValue.addEventListener('click', function() {
  slider.setMinValue(10);
});

var setMaxValue = document.getElementById('setMaxValue-my-range');

setMaxValue.addEventListener('click', function() {
  slider.setMaxValue(80);
});

/* ----------------------------- Slider 2 --------------------- */

var sliderConfig2 = {
  labelPrefix: 'R$ ',
  max: 200,
  min: 10,
};

var slider2 = RangeSlider('my-range2', sliderConfig2);

var view2 = document.getElementById('view2');

document.getElementById('my-range2').addEventListener('rangeChange', function(event) {
  view2.innerHTML = ['Min:', event.detail.min, '- Max:', event.detail.max].join(' ');
});