exports.filters = {
	contacts : function(doc) {
		return (doc.type && doc.type === 'contact');
	}
}

exports.views = {
	// Calendars
	all : {
		map : function(doc) {
			if (doc.type && doc.type === 'calendar') {
				emit(doc.id, doc);
			}
		}
	},
	by_google_id : {
		map : function(doc) {
			if (doc.type && doc.type === 'calendar') {
				if (doc.google && doc.google.id) {
					emit(doc.google.id, doc);
				}
			}

		},
	},
	// Events
	events_by_cal : {
		map : function(doc) {
			if (doc.type && doc.type === 'event') {
				emit(doc.calendarId, doc._rev);
			}
		}
	},
	event_by_start : {
		map : function(doc) {
			if (doc.type && doc.type === 'event') {
				if (doc.start && doc.start.date) {
					emit(doc.start.date, doc);
				}
			}
		}
	},
	event_by_start_recurrence : {
		map : function(doc) {
			var date_helper = require('views/lib/date_helper');
			var sumDates = date_helper.sumDates;
			var moment = date_helper.moment;
//			log(moment().format());
	
			if (doc.type && doc.type === 'event') {
				if (doc.start && doc.start.date) {
					emit(doc.start.date, {
						_id : doc._id,
						name : doc.name,
						start : {
							date : doc.start.date
						},
						end : doc.end,
						sequenceNr : 0
					});
					if (doc.recurrence) {
						var count = doc.recurrence.count ? doc.recurrence.count : 100;
						var currentStartDate = doc.start.date;
						var currentEndDate = doc.end ? doc.end.date : null;
						if (doc.recurrence.frequency) {
							for ( var i = 1; i < count; i++) {
								currentStartDate = sumDates(currentStartDate, doc.recurrence.frequency);
								if (currentEndDate) {
									currentEndDate = sumDates(currentEndDate, doc.recurrence.frequency);
								}
								emit(currentStartDate, {
									_id : doc._id,
									name : doc.name,
									start : {
										date : currentStartDate
									},
									end : {
										date : currentEndDate
									},
									sequenceNr : i
								});

							}
						}
					}
				}
			}
			// log("map done.");
		}
	},
	event_trash : {
		map : function(doc) {
			if (doc.type && doc.type === 'deletedEvent') {
				emit(doc.dateDeleted, doc);
			}
		}
	},
	event_recurrence : {
		map : function(doc) {
			if (doc.type && doc.type === 'event') {
				if (doc.recurrence)
					emit(doc.recurrence, null);
			}
		}
	},
};

exports.lists = {
	html : function(head, req) {
		provides("html", function() {
			var list = [];

			while (row = getRow()) {
				list.push(row.value);
			}

			var handlebars = require('handlebars');
			return handlebars.templates['list.html']({
				contacts : list
			}, {});
		});
	}
}

exports.shows = {
	detail : function(doc, req) {
		var handlebars = require('handlebars');
		if (doc) {

			// handlebars.templates contains any templates loaded from the
			// template
			// directory in your
			// kanso.json, if you're not using the build-steps then this will
			// not exist.
			var html = handlebars.templates['contact_detail.html']({
				doc : doc
			}, {});
			return html;
		} else {
			// no doc-id supplied
		}
	}
};

exports.documents = documents = [];

// for testing:
var emit = function(key, value) {
	documents.push({
		key : key,
		value : value
	});
};

var log = function(l) {
	console.log(l);
}
