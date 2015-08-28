SaaSProfitSimulation = function() {
  this.setVisitorsPerMonth(1000);
  this.setConversionRate(0.1);
  this.setChurnRate(0.4);
  this.setReferralRate(0.1);
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
  var secondsPerMonth = 10;
  var framesPerMonth = framesPerSecond * secondsPerMonth;
  var msPerFrame = 1000 / framesPerSecond;

  var self = this;
  self._frameCount = 0;

  setInterval(function() {
    console.log("FRAME #: ", self._frameCount);
    self._frameCount++;
  }, msPerFrame);
};
