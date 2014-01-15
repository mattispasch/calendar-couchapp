var moment = require("views/lib/moment");

exports.leapYear = leapYear = function(year) {
	if (year % 400 == 0) {
		return true;
	}
	if (year % 100 == 0) {
		return false;
	}
	if (year % 4 == 0) {
		return true;
	}
	return false;
};

exports.daysInMonth = daysInMonth = function(month, year) {
	switch (month) {
	case 1:
		return 31;
	case 2:
		return leapYear(year) ? 29 : 28;
	case 3:
		return 31;
	case 4:
		return 30;
	case 5:
		return 31;
	case 6:
		return 30;
	case 7:
		return 31;
	case 8:
		return 31;
	case 9:
		return 30;
	case 10:
		return 31;
	case 11:
		return 30;
	case 12:
		return 31;
	default:
		throw "ERROR: month was " + month;
	}
};

exports.sumDatesOld = function(date, freq) {
	// log("sumDates: " + date + " + " + freq);
	if (date.length >= freq.length) {
		var res = [];
		// add
		for ( var i = 0; i < freq.length; i++) {
			res[i] = date[i] + freq[i];
		}
		// if date.length > freq.length copy those
		for ( var i = freq.length; i < date.length; i++) {
			res[i] = date[i];
		}

		// Seconds:
		if (res[5] && res[5] >= 60) {
			res[4] = res[4] + Math.floor(res[5] / 60);
			res[5] = res[5] % 60;
		}
		// Minutes:
		if (res[4] && res[4] >= 60) {
			res[3] = res[3] + Math.floor(res[4] / 60);
			res[4] = res[4] % 60;
		}
		// Hours:
		if (res[3] && res[3] >= 24) {
			res[2] = res[2] + Math.floor(res[3] / 24);
			res[3] = res[3] % 24;
		}

		// Months Days:
		while ((res[1] && res[1] > 12) || (res[2] && res[2] > daysInMonth(res[1], res[0]))) {
			// log("month: " + res[1] + ", day: " + res[2]);
			// Months:
			while (res[1] && res[1] > 12) {
				// add one to year
				res[0] = res[0] + 1;
				// Go back 12 months
				res[1] = res[1] - 12;
			}
			// Days:
			if (res[2] && res[2] > daysInMonth(res[1], res[0])) {
				// go back as many days as current month has
				res[2] = res[2] - daysInMonth(res[1], res[0]);
				// add one month
				res[1] = res[1] + 1;
			}
		}
		return res;
	} else {
		return date;
	}
};

exports.sumDates = function(date, freq) {
	var startDate = moment().utc();
	startDate.year(date[0]);
	startDate.month(date[1] - 1);
	startDate.date(date[2]);
	startDate.hour(date[3]);
	startDate.minutes(date[4]);
	startDate.seconds(date[5]);
	startDate.local();
	startDate.add({
		years: freq[0],
		months: freq[1],
		days: freq[2],
		hours: freq[3],
		minutes: freq[4],
		seconds: freq[5]
	});
	startDate.utc();
	return [ startDate.year(), startDate.month() + 1, startDate.date(), startDate.hour(), startDate.minute(), startDate.second() ];
};

exports.moment = moment;