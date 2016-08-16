var Datepicker=function(e){function __webpack_require__(n){if(t[n])return t[n].exports;var o=t[n]={exports:{},id:n,loaded:!1};return e[n].call(o.exports,o,o.exports,__webpack_require__),o.loaded=!0,o.exports}var t={};return __webpack_require__.m=e,__webpack_require__.c=t,__webpack_require__.p="",__webpack_require__(0)}([function(e,t,n){n(1),e.exports=n(2)},function(e,t){},function(e,t,n){"use strict";n(1),n(3);var o=function(){function Datepicker(t){function validOptions(e){var t=!0,n=["date","input","display","button","min","max","filter","onOpen","onClose","onSelectDate"];return Object.keys(e).forEach(function(e){n.indexOf(e)<0&&(console.warn("Option '"+e+"' is not supported by the date picker"),t=!1)}),e.input?"hidden"!==e.input.type||e.display||(console.warn("Option 'input' may only be of type 'hidden' if a 'display' element is configured"),t=!1):(console.warn("Option 'input' is required"),t=!1),u&&"Invalid date"===u.toString()&&(console.warn("Option 'min' must be a valid date string or object"),t=!1),p&&"Invalid date"===p.toString()&&(console.warn("Option 'max' must be a valid date string or object"),t=!1),e.filter&&"function"!=typeof e.filter&&(console.warn("Option 'filter' must be a function that returns a boolean for a given date"),t=!1),["onOpen","onClose","onSelectDate"].forEach(function(t){e[t]&&"function"!=typeof e[t]&&console.warn("Option '"+t+"' must be a function")}),!!t||(console.error("Date picker could not be initialized due to warnings"),!1)}function updateDate(){updateDateInput(),updateDateDisplay()}function updateDateInput(){n.input.value=n.date.format(n.formatInput)}function updateDateDisplay(){n.display&&(n.display.innerText=n.date.format(n.formatDisplay))}function renderCalendar(){var e,t,o=window.innerWidth||window.outerWidth,i=(n.display||n.input).getBoundingClientRect();(n.display||n.input).parentNode.appendChild(n.container),n.container.className="datepicker",renderCalendarHeader(),n.container.setAttribute("style","visibility:hidden;overflow:hidden;position:absolute;"),i.left+n.container.offsetWidth>o?(t=o<n.container.offsetWidth+n.container.offsetWidth/5?(o-n.container.offsetWidth)/2:o-n.container.offsetWidth-n.container.offsetWidth/10,e=i.top):(t=i.left,e=i.bottom),n.container.style.top=e+"px",n.container.style.left=t+"px"}function renderCalendarHeader(){var e=["S","M","T","W","T","F","S"],t=document.createElement("table"),o=document.createElement("thead"),i=document.createElement("tr");n.container.appendChild(t),t.className="datepicker-header",e.forEach(function(e){var t=document.createElement("th");t.innerText=e,i.appendChild(t)}),o.appendChild(i),t.appendChild(o)}function renderMonths(){var e,t,o=document.createElement("div"),i=n.date.clone().subtract(1,"month").endOf("month"),r=n.date.clone(),a=n.date.clone().add(1,"month").startOf("month");n.container.appendChild(o),o.className="datepicker-months",o.setAttribute("style","overflow-y:auto;position:relative;visibility:hidden;width:100%;"),n.min&&!i.isAfter(n.min)||n.months.push(i),n.months.push(r),n.min&&!a.isBefore(n.max)||n.months.push(a),n.months.forEach(function(n){e=renderMonth(n),o.appendChild(e),n===r&&(t=e)}),o.style.height=7.5*o.querySelector("td").offsetHeight+"px",o.style.paddingRight=o.offsetWidth-o.clientWidth+"px",o.scrollTop=t.offsetTop,o.addEventListener("scroll",monthScrollHandler),o.style.visibility="visible"}function destroyMonths(){var e=n.container.querySelector(".datepicker-months");e&&(e.parentNode.removeChild(e),n.months.splice(0))}function renderMonth(e){var t=document.createElement("table"),n=t.appendChild(document.createElement("caption")),o=t.appendChild(document.createElement("tbody")),i=e.clone().startOf("month"),r=e.clone().endOf("month");t.className="datepicker-month",n.innerText=e.format("MMM YYYY"),i.day()>2&&(n.className="inset");do o.appendChild(renderWeek(i));while(i<r);return t}function renderWeek(e){var t=document.createElement("tr"),n=e.month();fillWeek(t,e.day());do t.appendChild(document.createElement("td")).appendChild(renderDay(e.clone()));while(e.add(1,"day").day()>0&&e.month()===n);return e.month()!==n&&e.day()>0&&fillWeek(t,7-e.day()),t}function renderDay(e){var t,o;return n.min&&e.isBefore(n.min)||n.max&&e.isAfter(n.max)||n.filter(e)?t=document.createElement("span"):(t=document.createElement("a"),t.href="#",t.title=e.format("MMMM Do, YYYY"),t.addEventListener("click",selectDateHandler(e))),t.innerText=e.date(),o=t.className.split(" "),e.isSame(n.date,"day")&&o.push("selected"),e.isSame(moment(),"day")&&o.push("today"),t.className=o.join(" "),t}function fillWeek(e,t){for(;t>0;t--)e.appendChild(document.createElement("td"))}function openPickerHandler(e){n.open()}function closePickerHandler(e){"Escape"!==e.key&&"27"!==e.keyCode||n.close()}function togglePickerHandler(e){e.preventDefault(),n.isOpen()?n.close():n.open()}function monthScrollHandler(){var e,t=n.container.querySelector(".datepicker-months"),o=2*t.querySelector("td").offsetHeight;t.scrollTop<o?(e=n.months[0].clone().subtract(1,"month").endOf("month"),n.min&&!e.isAfter(n.min)||(n.months.unshift(e),t.insertBefore(renderMonth(n.months[0]),t.querySelector("table")),t.scrollTop=t.querySelectorAll("table")[1].offsetTop+o)):t.scrollHeight-t.scrollTop<t.offsetHeight+o&&(e=n.months[n.months.length-1].clone().add(1,"month").startOf("month"),n.max&&!e.isBefore(n.max)||(n.months.push(e),t.appendChild(renderMonth(n.months[n.months.length-1]))))}function selectDateHandler(e){return function(t){t.preventDefault(),n.selectDate(e)}}var n=this,o={writeable:!1,enumerable:!1,configurable:!1},i=document.createElement("aside"),r=[],a=!1,l=t.input,d=t.display,c=t.button,s=t.date?moment(t.date):moment(),u=t.min?moment(t.min):null,p=t.max?moment(t.max):null,m=t.filter||function(e){return!1},f=t.formatInput||"YYYY-MM-DD",h=t.formatDisplay||"MMMM Do, YYYY";return!!validOptions(t)&&(Object.defineProperties(this,{filter:merge({value:m},o),formatInput:merge({value:f},o),formatDisplay:merge({value:h},o),selectDate:merge({value:function value(e){n.date=e,t.onSelectDate.bind(this)(e),n.close()}},o),close:merge({value:function value(){a&&(n.container.style.visibility="hidden",destroyMonths(),a=!1,t.onClose.bind(this)())}},o),open:merge({value:function value(){a||(e.forEach(function(e){e.close()}),n.container.style.visibility="visible",renderMonths(),a=!0,t.onOpen.bind(this)())}},o),isOpen:merge({value:function value(){return a}},o),months:merge({value:r},o),container:merge({value:i},o),input:merge({value:l},o),date:{get:function get(){return s},set:function set(e){s=e?moment(e):moment(),updateDate()}}}),u&&Object.defineProperty(this,"min",merge({value:u},o)),p&&Object.defineProperty(this,"max",merge({value:p},o)),t.display&&Object.defineProperty(this,"display",merge({value:d},o)),t.button?(Object.defineProperty(this,"button",merge({value:c},o)),t.button.addEventListener("click",togglePickerHandler)):t.display?t.display.addEventListener("click",togglePickerHandler):t.input.addEventListener("focus",openPickerHandler),document.body.addEventListener("keyup",closePickerHandler),e.push(this),updateDate(),void renderCalendar())}function merge(e,t){var n={};return[e,t].forEach(function(e){for(var t in e)n[t]=e[t]}),n}var e=[];return Datepicker}();e.exports=o},function(e,t){e.exports=moment}]);
//# sourceMappingURL=datepicker.js.map