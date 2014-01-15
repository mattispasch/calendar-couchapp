var app = require("../lib/app");

describe("Event Recurrence-View", function() {
	var map = app.views.event_by_start_recurrence.map;
	var clearDocs = function(){
		while(app.documents.length > 0) {
			app.documents.pop();
		}
	};
	
	it("should emit yearly events correctly", function() {
		clearDocs();
		map({
			type : 'event',
			start : {
				date : [ 2010, 1, 27 ]
			},
			recurrence : {
				count : 2,
				frequency : [ 1 ]
			}
		});
		expect(app.documents[0].key).toEqual([ 2010, 1, 27 ]);
		expect(app.documents[1].key).toEqual([ 2011, 1, 27 ]);
	});
	it("should emit weekly events correctly (non-leap year)", function() {
		clearDocs();
		map({
			type : 'event',
			start : {
				date : [ 2013, 1, 27 ]
			},
			recurrence : {
				count : 7,
				frequency : [ 0, 0, 7 ]
			}
		});
		expect(app.documents[0].key).toEqual([ 2013, 1, 27 ]);
		expect(app.documents[1].key).toEqual([ 2013, 2, 3 ]);
		expect(app.documents[2].key).toEqual([ 2013, 2, 10 ]);
		expect(app.documents[3].key).toEqual([ 2013, 2, 17 ]);
		expect(app.documents[4].key).toEqual([ 2013, 2, 24 ]);
		expect(app.documents[5].key).toEqual([ 2013, 3, 3 ]);
		expect(app.documents[6].key).toEqual([ 2013, 3, 10 ]);
	});
	it("should emit weekly events correctly (leap year)", function() {
		clearDocs();
		map({
			type : 'event',
			start : {
				date : [ 2012, 1, 27 ]
			},
			recurrence : {
				count : 7,
				frequency : [ 0, 0, 7 ]
			}
		});
		expect(app.documents[0].key).toEqual([ 2012, 1, 27 ]);
		expect(app.documents[1].key).toEqual([ 2012, 2, 3 ]);
		expect(app.documents[2].key).toEqual([ 2012, 2, 10 ]);
		expect(app.documents[3].key).toEqual([ 2012, 2, 17 ]);
		expect(app.documents[4].key).toEqual([ 2012, 2, 24 ]);
		expect(app.documents[5].key).toEqual([ 2012, 3, 2 ]);
		expect(app.documents[6].key).toEqual([ 2012, 3, 9 ]);
	});
	it("should emit weekly events over a year change", function() {
		clearDocs();
		map({
			type : 'event',
			start : {
				date : [ 2013, 12, 27 ]
			},
			recurrence : {
				count : 3,
				frequency : [ 0, 0, 7 ]
			}
		});
		expect(app.documents[0].key).toEqual([ 2013, 12, 27 ]);
		expect(app.documents[1].key).toEqual([ 2014, 1, 3 ]);
		expect(app.documents[2].key).toEqual([ 2014, 1, 10 ]);
	});
	it("should emit weekly events (non allday)", function() {
		clearDocs();
		map({
			type : 'event',
			start : {
				date : [ 2013, 10, 24, 13, 45, 0 ]
			},
			recurrence : {
				count : 2,
				frequency : [ 0, 0, 7 ]
			}
		});
		expect(app.documents[0].key).toEqual([  2013, 10, 24, 13, 45, 0 ]);
		expect(app.documents[1].key).toEqual([  2013, 10, 31, 13, 45, 0 ]);
	});
});