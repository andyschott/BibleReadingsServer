window.app = function() {
  var baseUrl = 'http://www.biblegateway.com/passage/?search=';

  var self = {
    currentDate : new Date(),

    createReadingUrl: function(date) {
      return'/reading/' + (date.getMonth() + 1) + '/' + date.getDate();
    },

    createReadingsLink: function(reading) {
      var url =  baseUrl + this.buildReadingTitle(reading);
      return encodeURI(url);
    },

    createAllReadingsLink: function(readings) {
      var titles = [];
      for(var i = 0; i < readings.length; i++) {
        titles.push(this.buildReadingTitle(readings[i]));
      }

      var url = baseUrl + titles.join(';');
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
    },

    getReadings : function(date) {
      var req = new XMLHttpRequest();
      req.open('get', self.createReadingUrl(date), true);
      req.onload = function() {
        var readings = JSON.parse(this.responseText);

        var readingsList = document.getElementById('readings');

        // Remove any current readings
        while(readingsList.lastChild) {
          readingsList.removeChild(readingsList.lastChild);
        }

        // Add all readings to the list
        for(var i = 0; i < readings.length; i++) {
          var li = document.createElement('li');
          var a = document.createElement('a');
          a.href = self.createReadingsLink(readings[i]);
          a.textContent = self.buildReadingTitle(readings[i]);
          li.appendChild(a);
          readingsList.appendChild(li);
        }

        // Build the link to open all readings at once
        var url = self.createAllReadingsLink(readings);
        var openAllReadings = document.getElementById('openAllReadings');
        openAllReadings.href = url;

        // Update the title
        var title = document.getElementById('title');
        title.textContent = 'Bible Readings for ' + self.createDateString(date);
      };
      req.send();
    },

    createDateString: function(date, includeYear) {
      var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
                      'Friday', 'Saturday'];
      var months = ['January', 'February', 'March', 'April',
                    'May', 'June', 'July', 'August',
                    'September', 'October', 'November', 'December'];
      var s = weekdays[date.getDay()] + ', ' + months[date.getMonth()] + ' ' +
        date.getDate();
      if(includeYear === undefined || includeYear) {
        s += ', ' + date.getFullYear();
      }

      return s;
    },

    updateLastReader : function() {
      var req = new XMLHttpRequest();
      req.open('get', '/lastReader', true);
      var welf = this;
      req.onload = function() {
         var lastReader = document.getElementById('lastReader');
         var reader = JSON.parse(this.responseText);
         lastReader.textContent = welf.buildReaderText(reader);
      };
      req.send();
    },

    buildReaderText : function(reader) {
      var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
                      'Friday', 'Saturday'];

      var name = '';
      var time = '';
      if(0 == reader.name.length) {
        name = 'No one';
        time = 'last time';
      }
      else {
        var today = new Date();
        today.setHours(0,0,0,0);
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0,0,0,0);
        var lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        lastWeek.setHours(0,0,0,0);

        var readerDate = new Date(reader.date);

        if(!reader.date) {
          time = 'last time';
        }
        else if(+readerDate === +today) {
          time = 'today';
        }
        else if(+readerDate === +yesterday) {
          time = 'yesterday';
        }
        else if(+readerDate >= +lastWeek) {
          time = weekdays[readerDate.getDay()];
        }
        else {
          time = self.createDateString(readerDate, false);
        }
      }

      return reader.name + ' read first ' + time;
    }
  };

  return {
    onLoad: function() {
      this.todaysReadings();
      self.updateLastReader();
    },

    todaysReadings : function() {
      self.currentDate = new Date();
      self.currentDate.setHours(0,0,0,0);
      self.getReadings(self.currentDate);
    },

    nextReadings : function() {
      self.currentDate.setDate(self.currentDate.getDate() + 1);
      self.getReadings(self.currentDate);
    },

    prevReadings : function() {
      self.currentDate.setDate(self.currentDate.getDate() - 1);
      self.getReadings(self.currentDate);
    },

    updateLastReader: function() {
    }
  };
}();
