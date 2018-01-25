var basicRangeSliderConfig = {
    min: 0,
    max: 100
}

CurrencyRangeSlider('basic-range-slider', basicRangeSliderConfig);
CurrencyRangeSlider('how-to-range-slider', basicRangeSliderConfig);


var labelPrefixRangeSliderConfig = {
    min: 0,
    max: 100,
    labelPrefix: 'R$ '
}

CurrencyRangeSlider('label-prefix-range-slider', labelPrefixRangeSliderConfig);

var limitRangeSliderConfig = {
    min: 20,
    max: 100,
    range: {
        min: 38,
        max: 89
    },
    limitToRange: false
}

CurrencyRangeSlider('limit-range-slider', limitRangeSliderConfig);

var inputEnterRangeSliderConfig = {
    min: 0,
    max: 100,
    inputEnter: true
};

CurrencyRangeSlider('input-enter-range-slider', inputEnterRangeSliderConfig);
s