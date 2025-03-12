(function(){

  var headings = {
    "th.yourtime" : "Fecha",
    "th.speaker"  : "Ponente",
    "th.title"    : "Título"
  };

  var month = {
    "Jan" : 1, "Feb" : 2, "Mar" : 3, "Apr" : 4, "May" : 5, "Jun" : 6,
    "Jul" : 7, "Aug" : 8, "Sep" : 9, "Oct" : 10, "Nov" : 11, "Dec" : 12,
  }

  var _ = {
      "TBA" : "A ser anunciado",
      "Schedule hosted at" : "Cronograma en"
  };

  // Translate a date
  var _date = function(s) {
    var words = s.split(" ");
    return words[1] + "/" + month[words[0]];
  }

  // hook into finishEmbed;
  var _finishEmbed  = seminarEmbedder.finishEmbed;
  seminarEmbedder.finishEmbed = function(target, event, response) {
    _finishEmbed(target, event, response);

    // Translate table headings
    for (var selector in headings) {
      target.querySelector(selector).innerText = headings[selector];
    }

    // change colspan of this th to be 1 instead of 3
    target.querySelector('th.yourtime').setAttribute("colspan", 1);

    // delete weekday in schedule
    var ts = target.querySelectorAll('td.weekday');
    for (var i=0; i < ts.length; ++i) { ts[i].remove(); }

    // delete time in schedule
    var ts = target.querySelectorAll('td.time');
    for (var i=0; i < ts.length; ++i) { ts[i].remove(); }

    // Translate dates
    var dates = target.querySelectorAll('td.monthdate');
    for (var i=0; i < dates.length; ++i) {
      dates[i].innerText = _date(dates[i].innerText);
    }

    // Translate TBA
    var ts = target.querySelectorAll('td.talktitle > a');
    for (var i=0; i < ts.length; ++i) {
      var speaker = ts[i].parentElement.parentElement.
            querySelector('td.speaker').innerText;
      if (speaker == "") {
          ts[i].innerText = "";
      }
      if (ts[i].innerText == "TBA") {
        ts[i].innerText = _["TBA"];
      }
    }

    // Translate table caption
    var ts = target.querySelector('caption');
    var s = "Schedule hosted at";
    ts.innerHTML = ts.innerHTML.replace(s, _[s]);

  }

})();
