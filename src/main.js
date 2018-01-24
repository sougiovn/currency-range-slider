var basicRangeSliderConfig = {
  min: 0,
  max: 100
}

CurrencyRangeSlider('basic-range-slider', basicRangeSliderConfig);
CurrencyRangeSlider('modo-uso-range-slider', basicRangeSliderConfig);


var labelRangeSliderConfig = {
  min: 0,
  max: 100,
  labelPrefix: 'R$ '
}

CurrencyRangeSlider('label-range-slider', labelRangeSliderConfig);



// var sliderConfig = {
//   labelPrefix: 'R$ ',
//   max: 100,
//   min: 10,
//   limitToRange: false,
//   inputEnter: true
// };

// var slider = CurrencyRangeSlider('my-range', sliderConfig);

// var view = document.getElementById('view');

// document.getElementById('my-range').addEventListener('rangeChange', function(event) {
//   view.innerHTML = ['Min:', event.detail.min, '- Max:', event.detail.max].join(' ');
// });

// var destroyButton = document.getElementById('destroy-my-range');

// destroyButton.addEventListener('click', function() {
//   slider.destroy();
// });

// var setMinValue = document.getElementById('setMinValue-my-range');

// setMinValue.addEventListener('click', function() {
//   slider.setMinValue(10);
// });

// var setMaxValue = document.getElementById('setMaxValue-my-range');

// setMaxValue.addEventListener('click', function() {
//   slider.setMaxValue(80);
// });

// var setLimitToRange = document.getElementById('setLimitToRange-my-range');

// setLimitToRange.addEventListener('click', function() {
//   slider.setLimitToRange(true);
// });