window.app = function() {
  var baseUrl = 'http://www.biblegateway.com/passage/?search=';

  var self = {
    createReadingUrl: function(date) {
      return'/reading/' + (date.getMonth() + 1) + '/' + date.getDate();
    },

    createReadingsLink: function(reading) {
      return baseUrl + reading.book + "%20" + reading.start_chapter;
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

        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = self.createReadingsLink(readings[0]);
        a.textContent = readings[0].book + " " + readings[0].start_chapter;
        li.appendChild(a);
        readingsList.appendChild(li);

        alert(this.responseText);
      };
      req.send();
    }
  };
}();
