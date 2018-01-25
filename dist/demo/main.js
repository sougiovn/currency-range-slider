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

var shortDebounceRangeSliderConfig = {
    min: 0,
    max: 100,
    debounceTime: 100
};
CurrencyRangeSlider('short-debounce-range-slider', shortDebounceRangeSliderConfig);

var longDebounceRangeSliderConfig = {
    min: 0,
    max: 100,
    debounceTime: 1000
};
CurrencyRangeSlider('long-debounce-range-slider', longDebounceRangeSliderConfig);

var rangedRangeSliderConfig = {
    min: 0,
    max: 100,
    range: {
        min: 20,
        max: 75
    }
};
CurrencyRangeSlider('ranged-range-slider', rangedRangeSliderConfig);

var coloredRangeSliderConfig = {
    min: 0,
    max: 100,
    colors: {
        sliderBgColor: 'pink',
        sliderBoxShadowColor: 'darkred',
        highlightBgColor: 'lightblue',
        highlightBoxShadowColor: 'darkblue',
        viewerBgColor: 'darkgreen',
        viewerColor: 'lightgreen',
        viewerInputBottomBorder: 'yellow'
    }
};
CurrencyRangeSlider('colored-range-slider', coloredRangeSliderConfig);
