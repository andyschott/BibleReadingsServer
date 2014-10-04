window.app = function() {
  var baseUrl = 'http://www.biblegateway.com/passage/?search=';

  var self = {
    createReadingUrl: function(date) {
      return'/reading/' + (date.getMonth() + 1) + '/' + date.getDate();
    },

    createReadingsLink: function(reading) {
      var url =  baseUrl + this.buildReadingTitle(reading);
      return encodeURI(url);
    },

    buildReadingTitle : function(reading) {
      if(reading.start_chapter === reading.end_chapter) {
        if(reading.start_verse === reading.end_verse) {
          return reading.book + " " + reading.start_chapter;
        }
        else {
          return reading.book + " " + reading.start_chapter + ":" + reading.start_verse + " - " + reading.end_verse;
        }
      }
      else {
        if(reading.start_verse === reading.end_verse) {
          return reading.book + " " + reading.start_chapter + " - " + reading.end_chapter;
        }
        else {
          return reading.book + " " + reading.start_chapter + ":" + reading.start_verse + " - " + reading.end_chapter + ":" + reading.end_verse;
        }
      }
    }
  };

  return {
    onLoad: function() {
      var today = new Date();
      var req = new XMLHttpRequest();
      req.open('get', self.createReadingUrl(today), true);
      req.onload = function() {
        var readings = JSON.parse(this.responseText);

        var readingsList = document.getElementById('readings');

        for(var i = 0; i < readings.length; i++) {
          var li = document.createElement('li');
          var a = document.createElement('a');
          a.href = self.createReadingsLink(readings[i]);
          a.textContent = self.buildReadingTitle(readings[i]);
          li.appendChild(a);
          readingsList.appendChild(li);
        }
      };
      req.send();
    }
  };
}();
