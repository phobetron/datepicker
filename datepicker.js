"use strict";

var Datepicker = (function() {

  var datepickers = [];

  function Datepicker(options) {
    var validOptions = [
          'date',
          'input',
          'display',
          'button',
          'min',
          'max',
          'filter'
        ],
        valid = true,
        defaultDescriptor = {
          writeable: false,
          enumerable: false,
          configurable: false
        },
        _date, _min, _max, _open,
        _this = this,
        displayedMonths = [],
        calendarContainer = document.createElement('aside');

    Object.keys(options).forEach(function(option) {
      if (validOptions.indexOf(option) < 0) {
        console.warn('Option \''+option+'\' is not supported by the date picker');
        valid = false;
      }
    });

    _date = options.date ? moment(options.date) : moment();
    _min = options.min ? moment(options.min) : null;
    _max = options.max ? moment(options.max) : null;

    if (!options.input) {
      console.warn('Option \'input\' is required');
      valid = false;
    } else if (options.input.type === 'hidden' && !options.display) {
      console.warn('Option \'input\' may only be of type \'hidden\' if a \'display\' element is configured');
      valid = false;
    }

    if (_min && _min.toString() === 'Invalid date') {
      console.warn('Option \'min\' must be a valid date string or object');
      valid = false
    }

    if (_max && _max.toString() === 'Invalid date') {
      console.warn('Option \'max\' must be a valid date string or object');
      valid = false
    }

    if (options.filter && typeof options.filter !== 'function') {
      console.warn('Option \'filter\' must be a function that returns a boolean for a given date');
      valid = false;
    }

    if (!valid) {
      console.error('Date picker could not be initialized due to warnings');
      return false;
    }

    Object.defineProperties(this, {
      close: merge({
        value: function() {
          _open = false;
          calendarContainer.style.display = 'none';
        }
      }, defaultDescriptor),

      open: merge({
        value: function() {
          datepickers.forEach(function(dp) {
            dp.close();
          });

          _open = true;
          calendarContainer.style.display = 'block';
        }
      }, defaultDescriptor),

      isOpen: merge({
        value: function() { return _open; }
      }, defaultDescriptor),

      input: merge({
        value: options.input
      }, defaultDescriptor),

      formatInput: merge({
        value: options.formatInput || 'YYYY-MM-DD'
      }, defaultDescriptor),

      formatDisplay: merge({
        value: options.formatDisplay || 'MMMM Do, YYYY'
      }, defaultDescriptor),

      filter: merge({
        value: options.filter || function(d) { return false; }
      }, defaultDescriptor),

      date: {
        get: function() { return _date; },
        set: function(value) {
          _date = value ? moment(value) : moment();

          updateDate();
        }
      }
    });

    if (options.display) {
      Object.defineProperty(this, 'display', merge({
        value: options.display
      }, defaultDescriptor));
    }

    if (options.button) {
      Object.defineProperty(this, 'button', merge({
        value: options.button
      }, defaultDescriptor));

      options.button.addEventListener('click', togglePickerHandler);
    } else if (options.display) {
      options.display.addEventListener('click', togglePickerHandler);
    } else {
      options.input.addEventListener('focus', this.open);
    }

    if (_min) {
      Object.defineProperty(this, 'min', merge({
        value: _min
      }, defaultDescriptor));
    }

    if (_max) {
      Object.defineProperty(this, 'max', merge({
        value: _max
      }, defaultDescriptor));
    }

    datepickers.push(this);

    updateDate();
    renderCalendar();

    function updateDate() {
      updateDateInput();
      updateDateDisplay();
    }

    function updateDateInput() {
      _this.input.value = _this.date.format(_this.formatInput);
    }

    function updateDateDisplay() {
      if (_this.display) {
        _this.display.innerText = _this.date.format(_this.formatDisplay);
      }
    }

    function renderCalendar() {
      var monthContainer, monthTables, top, left;

      calendarContainer.className = 'datepicker';
      calendarContainer.appendChild(renderCalendarHeader());
      monthContainer = calendarContainer.appendChild(renderMonths());

      document.body.appendChild(calendarContainer);

      monthTables = monthContainer.querySelectorAll('table');

      monthContainer.style.height = (monthContainer.querySelector('td').offsetHeight * 7.5) + 'px';
      monthContainer.style.paddingRight = (monthContainer.offsetWidth - monthContainer.clientWidth) + 'px';
      monthContainer.scrollTop = monthTables[parseInt(monthTables.length / 2)].offsetTop;
      monthContainer.addEventListener('scroll', monthScrollHandler(monthContainer));
      monthContainer.style.visibility = 'visible';

      calendarContainer.setAttribute('style', 'display:none;overflow:hidden;position:absolute;');

      if (_this.display) {
        top = _this.display.offsetTop + _this.display.offsetHeight;
        left = _this.display.offsetLeft;
      } else {
        top = _this.input.offsetTop + _this.input.offsetHeight;
        left = _this.input.offsetLeft;
      }

      calendarContainer.style.top = top + 'px';
      calendarContainer.style.left = left + 'px';
    }

    function renderCalendarHeader() {
      var weekdays = [ 'S', 'M', 'T', 'W', 'T', 'F', 'S' ],
          table = document.createElement('table'),
          head = document.createElement('thead'),
          week = document.createElement('tr');

      table.className = 'datepicker-header';

      weekdays.forEach(function(day) {
        var th = document.createElement('th');
        th.innerText = day;
        week.appendChild(th);
      });

      head.appendChild(week);
      table.appendChild(head);

      return table;
    }

    function renderMonths() {
      var monthContainer = document.createElement('div'),
          prevMonth = _date.clone().subtract(1, 'month').endOf('month'),
          currMonth = _date.clone(),
          nextMonth = _date.clone().add(1, 'month').startOf('month'),
          months = [];

      monthContainer.className = 'datepicker-months';
      monthContainer.setAttribute('style', 'overflow-y:auto;position:relative;visibility:hidden;width:100%;');

      if (!_this.min || prevMonth.isAfter(_this.min)) { months.push(prevMonth); }

      months.push(currMonth);

      if (!_this.min || nextMonth.isBefore(_this.max)) { months.push(nextMonth); }

      months.forEach(function(month) {
        displayedMonths.push(month);

        monthContainer.appendChild(renderMonth(month));
      });

      return monthContainer;
    }

    function renderMonth(monthDate) {
      var month = document.createElement('table'),
          name = month.appendChild(document.createElement('caption')),
          days = month.appendChild(document.createElement('tbody')),
          iDate = monthDate.clone().startOf('month'),
          endDate = monthDate.clone().endOf('month');

      month.className = 'datepicker-month';

      name.innerText = monthDate.format('MMM YYYY');

      if (iDate.day() > 2) { name.className = 'inset'; }

      do {
        days.appendChild(renderWeek(iDate));
      } while (iDate < endDate)

      return month;
    }

    function renderWeek(weekDate) {
      var week = document.createElement('tr'),
          monthNumber = weekDate.month();

      fillWeek(week, weekDate.day());

      do {
        week.appendChild(document.createElement('td')).appendChild(renderDay(weekDate.clone()));
      } while (weekDate.add(1, 'day').day() > 0 && weekDate.month() === monthNumber)

      if (weekDate.month() !== monthNumber && weekDate.day() > 0) { fillWeek(week, 7 - weekDate.day()); }

      return week;
    }

    function renderDay(dayDate) {
      var day, classes;

      if (
          (_this.min && dayDate.isBefore(_this.min)) ||
          (_this.max && dayDate.isAfter(_this.max)) ||
          _this.filter(dayDate)
         ) {
        day = document.createElement('span');
      } else {
        day = document.createElement('a');
        day.href = '#';
        day.title = dayDate.format('MMMM Do, YYYY');
        day.addEventListener('click', selectDateHandler(dayDate));
      }
      day.innerText = dayDate.date();

      classes = day.className.split(' ');

      if (dayDate.isSame(_this.date, 'day')) { classes.push('selected'); }
      if (dayDate.isSame(moment(), 'day')) { classes.push('today'); }

      day.className = classes.join(' ');

      return day;
    }

    function fillWeek(week, count) {
      for (;count > 0; count--) {
        week.appendChild(document.createElement('td'));
      }
    }

    function togglePickerHandler(e) {
      e.preventDefault();

      _this.isOpen() ? _this.close() : _this.open();
    }

    function monthScrollHandler(monthContainer) {
      return function() {
        var loadArea = monthContainer.querySelector('td').offsetHeight * 2,
            newMonth;

        if (monthContainer.scrollTop < loadArea) {
          newMonth = displayedMonths[0].clone().subtract(1, 'month').endOf('month');

          if (!_this.min || newMonth.isAfter(_this.min)) {
            displayedMonths.unshift(newMonth);

            monthContainer.insertBefore(renderMonth(displayedMonths[0]), monthContainer.querySelector('table'));
            monthContainer.scrollTop = monthContainer.querySelectorAll('table')[1].offsetTop + loadArea;
          }
        } else if (monthContainer.scrollHeight - monthContainer.scrollTop < monthContainer.offsetHeight + loadArea) {
          newMonth = displayedMonths[displayedMonths.length-1].clone().add(1, 'month').startOf('month');

          if (!_this.max || newMonth.isBefore(_this.max)) {
            displayedMonths.push(newMonth);

            monthContainer.appendChild(renderMonth(displayedMonths[displayedMonths.length-1]));
          }
        }
      }
    }

    function selectDateHandler(selectedDate) {
      return function(e) {
        var classes = this.className.split(' ');

        e.preventDefault();

        calendarContainer.querySelectorAll('.selected').forEach(function(prv) {
          var otherClasses = prv.className.split(' ');

          otherClasses.splice(otherClasses.indexOf('selected'), 1);

          prv.className = otherClasses.join(' ');
        });

        if (classes.indexOf('selected') < 0) { classes.push('selected'); }

        this.className = classes.join(' ');

        _this.date = selectedDate;

        _this.close();
      }
    }
  }

  function merge(o1, o2) {
    var o = {};

    [o1, o2].forEach(function(on) {
      for (var attr in on) { o[attr] = on[attr]; }
    });

    return o;
  }

  return Datepicker;

})();
