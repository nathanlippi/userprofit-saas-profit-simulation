var namespacePrefix = "sps_";

SaaSProfitSimulation = function() {
  this.setVisitorsPerMonth(5);
  this.setConversionRate(0.1);
  this.setChurnRate(0.2);
  this.setReferralRate(0.1);

  this._people = {};
};

var fn = SaaSProfitSimulation.prototype;

fn.setVisitorsPerMonth = function(visitorsPerMonth) { // Positive number
  this._visitorsPerMonth = visitorsPerMonth;
};

fn.setConversionRate = function(conversionRate) { // Between 0 and 1
  this._conversionRate = conversionRate;
};

fn.setChurnRate = function(churnRate) { // Between 0 and 1
  this._churnRate = churnRate;
};

fn.setReferralRate = function(referralRate) { // Between 0 and 0.9
  this._referralRate = referralRate;
};

fn.start = function() {
  var framesPerSecond = 10;
  var secondsPerMonth = 5;
  var framesPerMonth = framesPerSecond * secondsPerMonth;
  var msPerFrame = 1000 / framesPerSecond;

  var self = this;

  function sendPersonEvent(person, eventName, additionalEventInfo) {
    var eventInfo = {};
    if(additionalEventInfo) eventInfo = additionalEventInfo;

    eventInfo.userId = person._userId;

    console.log("EVENT: ", namespacePrefix+eventName, eventInfo);
  }

  function doMonthly(person, cb) {
    if(Date.now() - person.getLastModified() > secondsPerMonth * 1000) {
      person.setChecked();
      cb();
    }
  }

  var partialPerson = 0;
  setInterval(function() {
    var newVisitors = self._visitorsPerMonth / framesPerMonth;
    partialPerson += (newVisitors - Math.floor(newVisitors));
    newVisitors = Math.floor(newVisitors);

    if(partialPerson > 1) {
      newVisitors++;
      partialPerson--;
    }

    for(var ii = 1; ii <= newVisitors; ii++) {
      var person = new SaaSSimulationPerson();

      self._people[person._userId] = person;
      sendPersonEvent(person, "created");
    }

    for(var key in self._people) {
      var person = self._people[key];

      switch(person.getState()) {
        case PERSON_STATES.CREATED:
          if(Math.random() < self._conversionRate) {
            sendPersonEvent(person, "converted");
            sendPersonEvent(person, "paid");
            delete self._people[key];
          }
          else {
            sendPersonEvent(person, "not_converted");
            delete self._people[key];
          }
          break;
        case PERSON_STATES.CONVERTED:
          doMonthly(person, function() {
            if(Math.random() < self._churnRate) {
              sendPersonEvent(person, "churned");
              delete self._people[key];
            }
            else {
              sendPersonEvent(person, "paid");
            }
          });
        break;
      }
    }

  }, msPerFrame);
};


////////////////
// Person

var PERSON_STATES = {
  CREATED: 0,
  CONVERTED: 1,
};

// http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
function generateId (len) { // len > 15 does not improve randomness
  return (Math.random().toString(36)+'00000000000000000').slice(2, len+2);
}

SaaSSimulationPerson = function(referredByUserId) {
  this._referredByUserId = referredByUserId;
  this._userId = generateId(15);
  this._createdOn = Date.now();

  this.setState(PERSON_STATES.CREATED);
};

var personFn = SaaSSimulationPerson.prototype;

personFn.setState = function(state) {
  this._state = state;
  this._lastModified = Date.now();
};

personFn.getState = function() {
  return this._state;
};

personFn.getLastModified = function() {
  return this._lastModified;
};

personFn.setChecked = function() {
  this._lastModified = Date.now();
};
