var SCORECARDS;

$(document).delegate('#index', 'pagebeforeshow', function () {
    getScorecards();
	});
	
function getScorecards() {
    $.ajax({
        url: "http://charlottechuckers.com/phonegapProto/php/getscorecards.php",
        type: "GET",
        async: false,
        dataType: "json",

        success: function (json) {
            SCORECARDS = json;


        },
        error: function (xhr) {
        },
        complete: function (xhr, status) {}
    });
}
function saveScores() {
	var scores2Save = allPlayersAndScores;
	
	$.ajax({
        url: "http://charlottechuckers.com/phonegapProto/php/admin/savescores.php",
        type: "POST",
		data: {
            scores2save : scores2Save
        },
        dataType: "json",
        async: false,
        success: function () {
            clearWeek();

        },
        error: function (xhr) {
        }
    });
	}
function clearWeek() {
var numOfCards = SCORECARDS.length;

$.ajax({
	url: "http://charlottechuckers.com/phonegapProto/php/admin/clearweek.php",
	type: "POST",
	data: {
		numofcards : numOfCards
    },
	dataType: "json",
	async: false,
    success: function () {
        alert("Week Cleared");

	},
    error: function (xhr) {
	}
});
}
