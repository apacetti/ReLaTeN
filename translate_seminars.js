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

    // Cut past talks older than 2025
    var t1 = "Reducción de funciones L de curvas elípticas módulo enteros";
    var ts = target.querySelectorAll('div[daterange="past"] tr');
    var cut = false;
    for (var i=0; i < ts.length; ++i) {
      var title = ts[i].querySelector('td.talktitle > a');
      if (title && title.innerText == t1) cut = true;
      if (cut) { ts[i].remove(); }
    }

    // Add video link in talks
    var ts = target.querySelectorAll('div.embedded_schedule > table');
    for (var i=0; i < ts.length; ++i) {
      var tr = ts[i].querySelectorAll('tbody > tr');
      for (var j=0; j < tr.length; ++j) {
        var td = document.createElement('td');
        var kwargs = tr[j].querySelector('td.talktitle > a').getAttribute("kwargs");
        var knowl = document.createElement("div"); knowl.innerHTML = kwargs;
        var links = knowl.querySelectorAll('div.talk-details-container > p > a');
        for (var k=0; k < links.length; ++k) {
          if (links[k].innerHTML == "video") {
            td.classList.add("video");
            td.appendChild(links[k]);
          }
        }
        tr[j].appendChild(td);
      }
    }

  }

})();
