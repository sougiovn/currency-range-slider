function CurrencyRangeSlider(elementId, config) {
  var CLICK = 'click';
  var DESTROY = 'destroy';
  var KEY_UP = 'keyup';
  var FOCUS_OUT = 'focusout';
  var MOUSE_DOWN = 'mousedown';
  var MOUSE_MOVE = 'mousemove';
  var MOUSE_UP = 'mouseup';
  var TOUCH_START = 'touchstart';
  var ON_TOUCH_START = 'ontouchstart';
  var TOUCH_MOVE = 'touchmove';
  var TOUCH_END = 'touchend';
  var MIN = 'min';
  var MAX = 'max';
  var NONE = 'none';
  var INLINE_BLOCK = 'inline-block';
  var VISIBLE = 'visible';
  var HIDDEN = 'hidden';
  var ENTER_KEY_CODE = 13;
  var RANGE_CHANGE = 'rangeChange';
  var SET_RANGE = 'setRange';

  var labelPrefix = '';
  var labelMin, labelMax;
  var minViewer, maxViewer, truncatedViewer, truncatedViewerInputs;
  var viewMinValue, viewMaxValue, viewTruncatedValue;
  var inputMinValue, inputMaxValue, inputTruncatedMinValue, inputTruncatedMaxValue;
  var editingMinValue = false, editingMaxValue = false, editingTruncatedValue = false;
  var maxSlider, maxValue;
  var minSlider, minValue;
  var range;
  var rangeHighlight;
  var rootElement;
  var rangeContainer, sliderRadius;
  var sliderWidth;
  var isMobile = false;
  var valueFormatter = defaultValueFormatter;
  var valueParser = defaultValueParser;
  var inputRegex = /^\d*(\,\d{1,2})?$/;
  var limitToRange = true;
  var inputEnter = false;
  var debounceTime = 600;
  var resolvedOnInputMinValueChange;
  var resolvedOnInputMaxValueChange;
  var resolvedOnInputTruncatedValueChange;

  init();

  function init() {
    setupHTMLRefs();
    setupConfig();
    setupLabels();
    setupSliderPositions();
    setupInputTypeEvents();
    setupMobileSupport();
    setupOutputEvents();
    setupInputEvents();
  }

  function setupMobileSupport() {
    isMobile = ON_TOUCH_START in document.documentElement;

    if (isMobile) {
      MOUSE_DOWN = TOUCH_START;
      MOUSE_MOVE = TOUCH_MOVE;
      MOUSE_UP = TOUCH_END;
    }
  }

  function setupInputEvents() {
    rootElement.addEventListener(DESTROY, destroy, true);
    rootElement.addEventListener(SET_RANGE, setRange, true)
  }

  function setupHTMLRefs() {
    rootElement = document.getElementById(elementId);

    createDOM();

    labelMin = document.querySelector(['#', elementId, ' .currency-range-slider-label-container .currency-range-slider-label-min'].join(''));
    labelMax = document.querySelector(['#', elementId, ' .currency-range-slider-label-container .currency-range-slider-label-max'].join(''));

    rangeContainer = document.querySelector(['#', elementId, ' .currency-range-slider-container'].join(''));
    rangeHighlight = document.querySelector(['#', elementId, ' .currency-range-slider-container .currency-range-slider-highlight'].join(''));

    minSlider = document.querySelector(['#', elementId, ' .currency-range-slider-container .currency-range-slider-min'].join(''));
    maxSlider = document.querySelector(['#', elementId, ' .currency-range-slider-container .currency-range-slider-max'].join(''));

    minViewer = document.querySelector(['#', elementId, ' .currency-range-slider-viewer-container .currency-range-slider-viewer-min'].join(''));
    viewMinValue = document.querySelector(['#', elementId, ' .currency-range-slider-viewer-container .currency-range-slider-viewer-min .currency-range-slider-viewer-view'].join(''));
    inputMinValue = document.querySelector(['#', elementId, ' .currency-range-slider-viewer-container .currency-range-slider-viewer-min .currency-range-slider-viewer-input'].join(''));

    truncatedViewer = document.querySelector(['#', elementId, ' .currency-range-slider-viewer-container .currency-range-slider-viewer-truncated'].join(''));
    truncatedViewerInputs = document.querySelector(['#', elementId, ' .currency-range-slider-viewer-container .currency-range-slider-viewer-truncated .currency-range-slider-viewer-inputs'].join(''));
    viewTruncatedValue = document.querySelector(['#', elementId, ' .currency-range-slider-viewer-container .currency-range-slider-viewer-truncated .currency-range-slider-viewer-view'].join(''));
    inputTruncatedMinValue = document.querySelector(['#', elementId, ' .currency-range-slider-viewer-container .currency-range-slider-viewer-truncated .currency-range-slider-viewer-input-min'].join(''));
    inputTruncatedMaxValue = document.querySelector(['#', elementId, ' .currency-range-slider-viewer-container .currency-range-slider-viewer-truncated .currency-range-slider-viewer-input-max'].join(''));

    maxViewer = document.querySelector(['#', elementId, ' .currency-range-slider-viewer-container .currency-range-slider-viewer-max'].join(''));
    viewMaxValue = document.querySelector(['#', elementId, ' .currency-range-slider-viewer-container .currency-range-slider-viewer-max .currency-range-slider-viewer-view'].join(''));
    inputMaxValue = document.querySelector(['#', elementId, ' .currency-range-slider-viewer-container .currency-range-slider-viewer-max .currency-range-slider-viewer-input'].join(''));

  }

  function createDOM() {
    rootElement.innerHTML = [
      '<div class="currency-range-slider-component">',
        '<div class="currency-range-slider-label-container">',
          '<span class="currency-range-slider-label currency-range-slider-label-min"></span>',
          '<span class="currency-range-slider-label currency-range-slider-label-max"></span>',
        '</div>',

        '<div class="currency-range-slider-container">',
          '<span class="currency-range-slider-highlight"></span>',
          '<span class="currency-range-slider currency-range-slider-min"></span>',
          '<span class="currency-range-slider currency-range-slider-max"></span>',
        '</div>',

        '<div class="currency-range-slider-viewer-container">',
          '<div class="currency-range-slider-viewer currency-range-slider-viewer-min">',
            '<span class="currency-range-slider-viewer-view"></span>',
            '<input type="text" class="currency-range-slider-viewer-input" />',
          '</div>',

          '<div class="currency-range-slider-viewer currency-range-slider-viewer-truncated">',
            '<span class="currency-range-slider-viewer-view"></span>',
            '<span class="currency-range-slider-viewer-inputs">',
              '<input type="text" class="currency-range-slider-viewer-input currency-range-slider-viewer-input-min" />',
              '-',
              '<input type="text" class="currency-range-slider-viewer-input currency-range-slider-viewer-input-max" />',
            '</span>',
          '</div>',

          '<div class="currency-range-slider-viewer currency-range-slider-viewer-max">',
            '<span class="currency-range-slider-viewer-view"></span>',
            '<input type="text" class="currency-range-slider-viewer-input" />',
          '</div>',
        '</div>',
      '</div>'].join('');
  }

  function setupConfig() {
    minValue = config.min;
    maxValue = config.max;
    sliderWidth = getClientRect(minSlider).width;
    sliderRadius = sliderWidth / 2;
    if (config.debounceTime != null && typeof config.debounceTime === 'number') {
      debounceTime = config.debounceTime;
    }
    if (config.inputEnter != null && typeof config.inputEnter === 'boolean') {
      inputEnter = config.inputEnter;
    }
    if (config.limitToRange != null && typeof config.limitToRange === 'boolean') {
      limitToRange = config.limitToRange
    }
    if (config.valueFormatter != null && typeof config.valueFormatter === 'function') {
      valueFormatter = config.valueFormatter;
    }
    if (config.valueParser != null && typeof config.valueFormatter === 'function') {
      valueParser = config.valueParser;
    }
    if (config.labelPrefix != null && typeof config.labelPrefix === 'string') {
      labelPrefix = config.labelPrefix;
    }
    var rangeMinValue = minValue;
    var rangeMaxValue = maxValue;
    if (config.range != null && typeof config.range === 'object' && config.range.min != null && typeof config.range.min === 'number' && config.range.max != null && typeof config.range.max === 'number') {
      rangeMinValue = config.range.min;
      rangeMaxValue = config.range.max;
    }
    range = {
      min: valueFormatter(rangeMinValue),
      max: valueFormatter(rangeMaxValue),
    };
  }

  function setupInputTypeEvents() {
    if (inputEnter) {
      resolvedOnInputMinValueChange = onEnterKey(onInputMinValueChange);
      resolvedOnInputMaxValueChange = onEnterKey(onInputMaxValueChange);
      resolvedOnInputTruncatedValueChange = onEnterKey(onInputTruncatedValueChange);
    } else {
      resolvedOnInputMinValueChange = debounce(onInputMinValueChange, debounceTime);
      resolvedOnInputMaxValueChange = debounce(onInputMaxValueChange, debounceTime);
      resolvedOnInputTruncatedValueChange = debounce(onInputTruncatedValueChange, debounceTime);
    }
  }

  function setupLabels() {
    labelMin.innerHTML = [labelPrefix, valueFormatter(minValue)].join('');
    labelMax.innerHTML = [labelPrefix, valueFormatter(maxValue)].join('');
  }

  function setupSliderPositions() {
    resolveMaxValue(valueParser(range.max));
    resolveMinValue(valueParser(range.min));
  }

  function setupOutputEvents() {
    setupWindowMouseUpEvent();
    setupMinSliderMouseDownEvent();
    setupMaxSliderMouseDownEvent();
    setupViewerViewEvents(MIN);
    setupViewerViewEvents(MAX);
  }

  function destroy() {
    window.removeEventListener(MOUSE_UP, onWindowMouseUp, true);

    rootElement.removeEventListener(DESTROY, destroy, true);
    rootElement.removeEventListener(MOUSE_MOVE, onMinSliderMouseMove, true);
    rootElement.removeEventListener(MOUSE_MOVE, onMaxSliderMouseMove, true);


    minSlider.removeEventListener(MOUSE_DOWN, onMinSliderMouseDown, true);
    maxSlider.removeEventListener(MOUSE_DOWN, onMaxSliderMouseDown, true);
    viewMinValue.removeEventListener(CLICK, toggleMinEditingMode, true);
    viewMaxValue.removeEventListener(CLICK, toggleMaxEditingMode, true);
    viewTruncatedValue.removeEventListener(CLICK, toggleTruncatedEditingMode, true);
    inputMinValue.removeEventListener(FOCUS_OUT, toggleMinEditingMode, true);
    inputMinValue.removeEventListener(KEY_UP, resolvedOnInputMinValueChange, true);
    inputMaxValue.removeEventListener(FOCUS_OUT, toggleMaxEditingMode, true);
    inputMaxValue.removeEventListener(KEY_UP, resolvedOnInputMaxValueChange, true);

    inputTruncatedMinValue.removeEventListener(FOCUS_OUT, toggleMaxEditingMode, true);
    inputTruncatedMinValue.removeEventListener(KEY_UP, resolvedOnInputMaxValueChange, true);
    inputTruncatedMaxValue.removeEventListener(FOCUS_OUT, toggleMaxEditingMode, true);
    inputTruncatedMaxValue.removeEventListener(KEY_UP, resolvedOnInputMaxValueChange, true);

    var destroyEvent = document.createEvent('Event');
    destroyEvent.initEvent(DESTROY);
    rootElement.dispatchEvent(destroyEvent);
  }

  function setRange(event) {
    var minValue = event.detail.min;
    var maxValue = event.detail.min;

    inputTruncatedMinValue.value = minValue;
    inputTruncatedMaxValue.value = maxValue;

    onInputTruncatedValueChange();
  }

  function setupWindowMouseUpEvent() {
    window.addEventListener(MOUSE_UP, onWindowMouseUp, true);
  }

  function setupMinSliderMouseDownEvent() {
    minSlider.addEventListener(MOUSE_DOWN, onMinSliderMouseDown, true);
  }

  function setupMaxSliderMouseDownEvent() {
    maxSlider.addEventListener(MOUSE_DOWN, onMaxSliderMouseDown, true);
  }

  function onMinSliderMouseDown() {
    rootElement.addEventListener(MOUSE_MOVE, onMinSliderMouseMove, true);
  }

  function onMaxSliderMouseDown() {
    rootElement.addEventListener(MOUSE_MOVE, onMaxSliderMouseMove, true);
  }

  function onWindowMouseUp() {
    rootElement.removeEventListener(MOUSE_MOVE, onMinSliderMouseMove, true);
    rootElement.removeEventListener(MOUSE_MOVE, onMaxSliderMouseMove, true);
  }

  function onMinSliderMouseMove(event) {
    resolveMinSliderMouseMove(getClientX(event));
  }

  function onMaxSliderMouseMove(mouseEvent) {
    resolveMaxSliderMouseMove(getClientX(event));
  }

  function resolveMinSliderMouseMove(mouseX) {
    var rangeContainerRect = getRangeContainerRect();

    var minSliderX = getMouseXOnRangeContainer(mouseX, rangeContainerRect);

    if (compareToMaxSlider(minSliderX, rangeContainerRect)) {
      minSlider.style.zIndex = 4;
      maxSlider.style.zIndex = 3;
      minSlider.style.left = maxSlider.style.left;
      range.min = range.max;
    } else {
      var rangeContainerWidth = rangeContainerRect.width;
      var calcMinSliderX = minSliderX - sliderRadius;

      var minSliderPct = getPercentage(calcMinSliderX, rangeContainerWidth);
      var minValuePct = getPercentage(calcMinSliderX, rangeContainerWidth);

      var minRangeValue = getRangeValue(minValuePct);

      minSlider.style.left = [minSliderPct, '%'].join('');
      range.min = valueFormatter(minRangeValue);
    }
    updateComponent(MIN);
    emitRangeValueChange();
  }

  function resolveMinViewerPosition() {
    var minViewerClientRect = getClientRect(minViewer);

    var rangeSliderContainer = getRangeContainerRect();

    var minViewerWidthPct = getPercentage(minViewerClientRect.width / 2, rangeSliderContainer.width);
    var sliderRadiusPct = getPercentage(sliderRadius, rangeSliderContainer.width)

    var minSliderPct = +minSlider.style.left.replace(/\%/, '');

    var minViewerXPct = (minSliderPct - minViewerWidthPct) + sliderRadiusPct;

    if (minSliderPct < minViewerWidthPct) {
      minViewerXPct = 0;
    }

    var maxViewerPct = 100 - (minViewerWidthPct * 2);

    if (minViewerXPct > 0) {
      if (minSliderPct > maxViewerPct) {
        minViewerXPct = maxViewerPct;
      }
    }

    minViewer.style.left = [minViewerXPct, '%'].join('');
  }

  function resolveMaxViewerPosition() {
    var maxViewerClientRect = getClientRect(maxViewer);

    var rangeSliderContainer = getRangeContainerRect();

    var maxViewerWidthPct = getPercentage(maxViewerClientRect.width / 2, rangeSliderContainer.width);
    var sliderRadiusPct = getPercentage(sliderRadius, rangeSliderContainer.width)

    var maxSliderPct = +maxSlider.style.left.replace(/\%/, '');

    var maxViewerXPct = (maxSliderPct - maxViewerWidthPct) + sliderRadiusPct;

    if (maxSliderPct < maxViewerWidthPct) {
      maxViewerXPct = 0;
    }

    var maxViewerPct = 100 - (maxViewerWidthPct * 2);

    if (maxViewerXPct > 0) {
      if (maxSliderPct > maxViewerPct) {
        maxViewerXPct = maxViewerPct;
      }
    }

    maxViewer.style.left = [maxViewerXPct, '%'].join('');
  }

  function resolveTruncatedViewer() {
    if (editingMinValue || editingMaxValue) {
      return;
    }
    var minViewerClientRect = getClientRect(minViewer);
    var maxViewerClientRect = getClientRect(maxViewer);
    var rangeSliderContainerRect = getRangeContainerRect();

    var minViewerFullWidth = minViewerClientRect.left + minViewerClientRect.width;
    var maxViewerFullWidth = maxViewerClientRect.left + maxViewerClientRect.width;

    var minLabel = [labelPrefix, range.min].join('');
    var maxLabel = [labelPrefix, range.max].join('');
    var rangeLabel = [minLabel, maxLabel].join(' - ');

    if (minViewerFullWidth > maxViewerClientRect.left) {
      minViewer.style.visibility = HIDDEN;
      maxViewer.style.visibility = HIDDEN;
      truncatedViewer.style.visibility = VISIBLE;
      viewTruncatedValue.innerHTML = rangeLabel;
      if (valueParser(range.min) === valueParser(range.max)) {
        viewTruncatedValue.innerHTML = minLabel;
      }
    } else {
      truncatedViewer.style.visibility = HIDDEN;
      minViewer.style.visibility = VISIBLE;
      maxViewer.style.visibility = VISIBLE;
      return;
    }

    editingTruncatedValue = false;
    setupTruncatedViewerViewEvents();
    resolveTruncatedViewerPosition();
  }

  function setupTruncatedViewerEvents() {
    viewTruncatedValue.removeEventListener(CLICK, toggleTruncatedEditingMode, true);
    viewTruncatedValue.addEventListener(CLICK, toggleTruncatedEditingMode, true);
  }

  function setupTruncatedViewerViewEvents() {
    truncatedViewerInputs.style.display = NONE;
    inputTruncatedMinValue.value = '';
    inputTruncatedMaxValue.value = '';

    viewTruncatedValue.style.display = INLINE_BLOCK;
    window.removeEventListener(CLICK, onTruncatedFocusOut, true);
    inputTruncatedMinValue.removeEventListener(KEY_UP, resolvedOnInputTruncatedValueChange, true);

    inputTruncatedMaxValue.removeEventListener(KEY_UP, resolvedOnInputTruncatedValueChange, true);

    viewTruncatedValue.addEventListener(CLICK, toggleTruncatedEditingMode, true);
  }

  function setupTruncatedViewerInputEvents() {
    viewTruncatedValue.style.display = NONE;
    truncatedViewerInputs.style.display = INLINE_BLOCK;

    viewTruncatedValue.removeEventListener(CLICK, toggleTruncatedEditingMode, true);

    window.addEventListener(CLICK, onTruncatedFocusOut, true);
    inputTruncatedMinValue.focus();
    inputTruncatedMinValue.addEventListener(KEY_UP, resolvedOnInputTruncatedValueChange, true);
    inputTruncatedMaxValue.addEventListener(KEY_UP, resolvedOnInputTruncatedValueChange, true);
  }

  function onTruncatedFocusOut(event) {
    if (event.target !== inputTruncatedMinValue && event.target !== inputTruncatedMaxValue) {
      toggleTruncatedEditingMode();
    }
  }

  function onInputTruncatedValueChange() {
    var minValue = inputTruncatedMinValue.value;
    var maxValue = inputTruncatedMaxValue.value;

    if (minValue != null && minValue.length > 0 && maxValue != null && maxValue.length > 0) {
      if (validateInput(minValue) && validateInput(maxValue)) {
        minValue = valueParser(minValue);
        maxValue = valueParser(maxValue);
        var rangeMinValue = valueParser(range.min);
        var rangeMaxValue = valueParser(range.max);

        if (minValue > rangeMaxValue) {
          resolveMaxValue(maxValue);
          resolveMinValue(minValue);
        } else {
          resolveMinValue(minValue);
          resolveMaxValue(maxValue);
        }
      }
    }
  }

  function toggleTruncatedEditingMode(event) {
    if (editingTruncatedValue) {
      setupTruncatedViewerViewEvents();
    } else {
      setupTruncatedViewerInputEvents();
    }
    editingTruncatedValue = !editingTruncatedValue;
  }

  function resolveTruncatedViewerPosition() {
    var truncatedViewerClientRect = getClientRect(truncatedViewer);
    var rangeSliderContainer = getRangeContainerRect();

    var truncatedViewerWidthPct = getPercentage(truncatedViewerClientRect.width / 2, rangeSliderContainer.width);
    var sliderRadiusPct = getPercentage(sliderRadius, rangeSliderContainer.width)

    var minSliderPct = +minSlider.style.left.replace(/\%/, '');
    var maxSliderPct = +maxSlider.style.left.replace(/\%/, '');

    var middleSlidersPct = minSliderPct + ((maxSliderPct - minSliderPct) / 2) + sliderRadiusPct;

    var truncatedViewerXPct = (middleSlidersPct - truncatedViewerWidthPct);

    if (middleSlidersPct < truncatedViewerWidthPct) {
      truncatedViewerXPct = 0;
    }

    var maxViewerPct = 100 - (truncatedViewerWidthPct * 2);

    if (truncatedViewerXPct > 0) {
      if (middleSlidersPct > maxViewerPct) {
        truncatedViewerXPct = maxViewerPct;
      }
    }

    truncatedViewer.style.left = [truncatedViewerXPct, '%'].join('');
    calculateRangeHighlight();
  }

  function resolveMaxSliderMouseMove(mouseX) {
    var rangeContainerRect = getRangeContainerRect();

    var maxSliderX = getMouseXOnRangeContainer(mouseX, rangeContainerRect);

    if (compareToMinSlider(maxSliderX, rangeContainerRect)) {
      maxSlider.style.zIndex = 4;
      minSlider.style.zIndex = 3;
      maxSlider.style.left = minSlider.style.left;
      range.max = range.min;
    } else {
      var rangeContainerWidth = rangeContainerRect.width;
      var calcMaxSliderX = maxSliderX - sliderRadius;

      var maxSliderPct = getPercentage(calcMaxSliderX, rangeContainerWidth);
      var maxValuePct = getPercentage(calcMaxSliderX, rangeContainerWidth - sliderWidth);

      var maxRangeValue = getRangeValue(maxValuePct);

      maxSlider.style.left = [maxSliderPct, '%'].join('');
      range.max = valueFormatter(maxRangeValue);
    }
    updateComponent(MAX);
    emitRangeValueChange();
  }

  function onInputMinValueChange(event) {
    var value = event.target.value;

    if (validateInput(value)) {
      value = valueParser(value);

      if (value < minValue) {
        if (!limitToRange) {
          minValue = value;
          setupLabels();
          resolveMaxValue(valueParser(range.max))
        } else {
          value = minValue;
        }
      }

      resolveMinValue(value);
      toggleMinEditingMode();
    }
  }

  function resolveMinValue(value) {
    var rangeContainerRect = getRangeContainerRect();

    var minSliderPct = getRangePercentage(value);
    var sliderRadiusPct = getPercentage(sliderRadius, rangeContainerRect.width);

    var minSliderX = getXFromPercentage(minSliderPct + sliderRadiusPct, rangeContainerRect.width);

    minSliderX += rangeContainerRect.left;

    resolveMinSliderMouseMove(minSliderX);
  }

  function onInputMaxValueChange(event) {
    var value = event.target.value;

    if (validateInput(value)) {
      value = valueParser(value);

      if (value > maxValue) {
        if (!limitToRange) {
          maxValue = value;
          setupLabels();
          resolveMinValue(valueParser(range.min))
        } else {
          value = maxValue;
        }
      }

      resolveMaxValue(value);
      toggleMaxEditingMode();
    }
  }

  function resolveMaxValue(value) {
    var rangeContainerRect = getRangeContainerRect();
    var sliderRadiusPct = getPercentage(sliderRadius, rangeContainerRect.width);

    var maxSliderPct = getRangePercentage(value);

    var maxSliderX = getXFromPercentage(maxSliderPct, (rangeContainerRect.width - sliderWidth));

    maxSliderX += rangeContainerRect.left + sliderRadius;

    resolveMaxSliderMouseMove(maxSliderX);
  }

  function updateComponent(type) {
    calculateRangeHighlight();
    var minLabel = [labelPrefix, range.min].join('');
    var maxLabel = [labelPrefix, range.max].join('');
    viewMinValue.innerHTML = minLabel;
    viewMaxValue.innerHTML = maxLabel;
    if (type === MIN) {
      resolveMinViewerPosition();
    } else {
      resolveMaxViewerPosition();
    }
    resolveTruncatedViewer();
  }

  function toggleMinEditingMode() {
    if (editingMinValue) {
      setupViewerViewEvents(MIN);
    } else {
      setupViewerInputEvents(MIN);
    }
    editingMinValue = !editingMinValue;
    updateComponent(MIN);
  }

  function toggleMaxEditingMode() {
    if (editingMaxValue) {
      setupViewerViewEvents(MAX);
    } else {
      setupViewerInputEvents(MAX);
    }
    editingMaxValue = !editingMaxValue;
    updateComponent(MAX);
  }

  function setupViewerViewEvents(type) {
    if (type === MIN) {
      inputMinValue.style.display = NONE;
      inputMinValue.value = '';
      viewMinValue.style.display = INLINE_BLOCK;
      inputMinValue.removeEventListener(KEY_UP, resolvedOnInputMinValueChange, true);
      inputMinValue.removeEventListener(FOCUS_OUT, toggleMinEditingMode, true);
      viewMinValue.addEventListener(CLICK, toggleMinEditingMode, true);
    } else {
      inputMaxValue.style.display = NONE;
      inputMaxValue.value = '';
      viewMaxValue.style.display = INLINE_BLOCK;
      inputMaxValue.removeEventListener(KEY_UP, resolvedOnInputMaxValueChange, true);
      inputMaxValue.removeEventListener(FOCUS_OUT, toggleMaxEditingMode, true);
      viewMaxValue.addEventListener(CLICK, toggleMaxEditingMode, true);
    }
  }

  function setupViewerInputEvents(type) {
    if (type === MIN) {
      viewMinValue.style.display = NONE;
      inputMinValue.style.display = INLINE_BLOCK;
      viewMinValue.removeEventListener(CLICK, toggleMinEditingMode, true);
      inputMinValue.focus();
      inputMinValue.addEventListener(FOCUS_OUT, toggleMinEditingMode, true);
      inputMinValue.addEventListener(KEY_UP, resolvedOnInputMinValueChange, true);
    } else {
      viewMaxValue.style.display = NONE;
      inputMaxValue.style.display = INLINE_BLOCK;
      viewMaxValue.removeEventListener(CLICK, toggleMaxEditingMode, true);
      inputMaxValue.focus();
      inputMaxValue.addEventListener(FOCUS_OUT, toggleMaxEditingMode, true);
      inputMaxValue.addEventListener(KEY_UP, resolvedOnInputMaxValueChange, true);
    }
  }

  function emitRangeValueChange() {
    var parsedRange = {
      min: valueParser(range.min),
      max: valueParser(range.max),
    };

    var rangeChangeEvent = document.createEvent('CustomEvent');
    rangeChangeEvent.initCustomEvent(RANGE_CHANGE, true, false, parsedRange);

    rootElement.dispatchEvent(rangeChangeEvent);
  }

  function calculateRangeHighlight() {
    var minSliderPct = +minSlider.style.left.replace(/\%/, '');
    var maxSliderPct = +maxSlider.style.left.replace(/\%/, '');
    var sliderRadiusPct = getPercentage(sliderRadius, getRangeContainerRect().width);

    var highlightStyle = {
      left: [minSliderPct + sliderRadiusPct, '%'].join(''),
      width: [maxSliderPct - minSliderPct, '%'].join(''),
    };

    rangeHighlight.style.left = highlightStyle.left;
    rangeHighlight.style.width = highlightStyle.width;
  }

  function compareToMinSlider(maxSliderX, rangeContainerRect) {
    var minSliderX = getSliderRectX(minSlider);
    return maxSliderX <= (minSliderX - rangeContainerRect.left);
  }

  function compareToMaxSlider(minSliderX, rangeContainerRect) {
    var maxSliderX = getSliderRectX(maxSlider);
    return minSliderX >= (maxSliderX - rangeContainerRect.left);
  }

  function getMouseXOnRangeContainer(mouseX, rangeContainerRect) {
    var rangeContainerX = rangeContainerRect.left;
    var rangeContainerFullWidth = rangeContainerX + rangeContainerRect.width;

    if (mouseX < (rangeContainerX + sliderRadius)) {
      mouseX = sliderRadius;
    } else if (mouseX > (rangeContainerFullWidth - sliderRadius)) {
      mouseX = rangeContainerRect.width - sliderRadius;
    } else {
      mouseX -= rangeContainerX;
    }
    return mouseX;
  }

  function getRangeValue(sliderPct) {
    return ((maxValue - minValue) * sliderPct / 100) + minValue;
  }

  function getRangePercentage(value) {
    return (100 * (value - minValue)) / (maxValue - minValue);
  }

  function getPercentage(value, total) {
    return (100 * value) / total;
  }

  function getXFromPercentage(pct, total) {
    return (total * pct) / 100;
  }

  function getClientRect(element) {
    return element.getBoundingClientRect();
  }

  function getSliderRectX(slider) {
    return getClientRect(slider).left + sliderRadius;
  }

  function getRangeContainerRect() {
    return rangeContainer.getBoundingClientRect();
  }

  function defaultValueFormatter(value) {
    if (value == null) {
      return '';
    }
    value = value.toFixed(2);
    return value.replace(/\./, ',');
  }

  function defaultValueParser(value) {
    if (value == null) {
      return 0;
    }
    value = value.replace(/\./g, '');
    value = value.replace(/\,/, '.');
    return +value;
  }

  function getClientX(event) {
    if (isMobile) {
      event = event.touches[0];
    }
    return event.clientX;
  }

  function validateInput(inputValue) {
    return inputValue != null && inputValue.length && inputRegex.test(inputValue);
  }

  function onEnterKey(fn) {
    return function(event) {
      var args = arguments;
      if (event.keyCode === ENTER_KEY_CODE) {
        fn.apply({}, args);
      }
    }
  }

  function debounce(fn, wait) {
    var timeout;
    return function () {
      var args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        fn.apply({}, args);
      }, wait);
    };
  }
}