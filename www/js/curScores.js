var ALLPLAYERS;
var SCORECARDS;
var RECORDS;
var HANDICAPS;

$(document).delegate('#index', 'pagebeforeshow', function () {
    getAllPlayers();
	getScorecards();
	getRecords();
	
	pullScorecards();
	});
	
function getAllPlayers() {
    $.ajax({
        url: "http://charlottechuckers.com/proto/php/getallplayers.php",
        type: "GET",
        dataType: "json",
        async: false,
        success: function (json) {
            ALLPLAYERS = json;

        },
        error: function (xhr) {
        }
    });

}

function getScorecards() {
    $.ajax({
        url: "http://charlottechuckers.com/proto/php/getscorecards.php",
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

function pullScorecards() {
	$.ajax({
        url: "http://charlottechuckers.com/proto/php/getallscorecards.php",
        type: "GET",
        async: false,
        dataType: "json",
		data: {number : SCORECARDS.length},

        success: function (json) {
			var updatedScore = [];
			
			jQuery.map(json, function( n, i) {
				var eachOne = [];
				jQuery.map(n, function( y, j) {
					var array = [];
					
					array[0] = 0;
					array[1] = 0;
					array[2] = 0;
					array[3] = 0;
					array[4] = 0;
					
					jQuery.map(y, function( q, p) {
						if(p == 'player_id') {
							array[0] += parseInt(q);
							} else if (p == 'player1') {
								array[1] += parseInt(q);
								} else if (p =='player2') {
									array[2] += parseInt(q);
									} else if (p =='player3') {
										array[3] += parseInt(q);
										} else if (p == 'player4') {
											array[4] += parseInt(q);
											}
						
						eachOne[j] = array;	
						});
					updatedScore[i] = eachOne;
					});
				});
				var allPlayersAndScores = [];
			jQuery.map(SCORECARDS, function( n, i) {
				jQuery.map(n, function(j, y) {
					var tally = 0;
					var count = 0;
					if(y === 'player_id') {
						for(g = 0; g < updatedScore[i].length; g++) {
							tally += updatedScore[i][g][0];
							count++;
							}

                        allPlayersAndScores[n.player_id] = (tally - (count * 3));
						}
					if(y === 'player1') {
						for(g = 0; g < updatedScore[i].length; g++) {
							tally += updatedScore[i][g][1];
							count++;
							}
						if (ALLPLAYERS[n.player1] === undefined) {
							return;
							}

                        allPlayersAndScores[n.player1] = (tally - (count * 3));
						}
					if(y === 'player2') {
						for(g = 0; g < updatedScore[i].length; g++) {
							tally += updatedScore[i][g][2];
							count++;
							}
						if (ALLPLAYERS[n.player2] === undefined) {
							return;
							}

                        allPlayersAndScores[n.player2] = (tally - (count * 3));
						}
					if(y === 'player3') {
						for(g = 0; g < updatedScore[i].length; g++) {
							tally += updatedScore[i][g][3];
							count++;
							}
						if (ALLPLAYERS[n.player3] === undefined) {
							return;
							}

                        allPlayersAndScores[n.player3] = (tally - (count * 3));
						}
					if(y === 'player4') {
						for(g = 0; g < updatedScore[i].length; g++) {
							tally += updatedScore[i][g][4];
							count++;
							}
						if (ALLPLAYERS[n.player4] === undefined) {
							return;
							}

                        allPlayersAndScores[n.player4] = (tally - (count * 3));
						}
					});
					
				});
					displayToContent(sortLeaderboards(allPlayersAndScores));
        },
        error: function (xhr) {
        },
        complete: function (xhr, status) {}
    });
	}
	
function displayToContent(array) {
	var scoreDiv = "<ul data-role='listview' data-inset='true' data-count-theme='b' data-divider-theme='a'>";
	scoreDiv += '<li data-role="list-divider">Handicap Scores</li>';
	//sort handicap array
	var handicappedArray = [];
	jQuery.each(array, function(index, value) {
		var singlePlayerArray = [];
		var playerName = value[0];
		var playerScore = value[1];
		var originalPlayerScore = value[1];
		if(typeof(playerScore) == "undefined") {
			return;
	} 
		/*if(playerScore == 0) {
			playerScore = "Par";
			}*/
		var handicap = matchHandicap(playerName);
		if(typeof(handicap) == "undefined") {
            var playerScore = playerScore;
        } else {
				var playerScore = playerScore - Math.round(matchHandicap(playerName));
			}
			singlePlayerArray[0] = playerName;
			singlePlayerArray[1] = playerScore;
			singlePlayerArray[2] = originalPlayerScore;
		handicappedArray.push(singlePlayerArray);
		});
		handicappedArray.sort(compare);
		for(i = 0; i < handicappedArray.length; i++) {
			
			scoreDiv +="<li><h2>" + handicappedArray[i][0] + "</h2><span class='ui-li-count'>" + handicappedArray[i][1] + "</span><p>Natural: " + handicappedArray[i][2] + "</p></li>";
			}
		scoreDiv += '<li data-role="list-divider">Natural Scores</li>';
		
	jQuery.each(array, function(index, value) {
		var playerName = value[0];
		var playerScore = value[1];
		var playerHandicap;
		/*if(playerScore == 0) {
			playerScore = "Par";
			}*/
		//Search through HANDICAPS for cur player//
		playerHandicap = matchHandicap(playerName);
		if(typeof(playerScore) == "undefined") {
			scoreDiv += "";
	} else if(typeof(playerHandicap) == "undefined"){
				scoreDiv += "<li><h2>" + playerName  + "</h2><span class='ui-li-count'>" + playerScore + "</span><p>Handicap : N/A<p></li>";
				} else if(playerHandicap !== false) {
			scoreDiv += "<li><h2>" + playerName  + "</h2><span class='ui-li-count'>" + playerScore + "</span><p>Handicap : " + Math.round(playerHandicap) + "</p></li>";
			}
					});
					$('#content').html(scoreDiv +"</ul>").trigger('create');
					$('#naturalDiv').css('text-align', 'center');
	
	
	
	}
function matchHandicap(playerName) {
	for(i = 0; i < HANDICAPS.length; i++) {
		if(HANDICAPS[i][0] == playerName) {
		return HANDICAPS[i][1];
		} else {
			
			}
	}
	}
function sortLeaderboards(array) {
	var totalPlayerArray = [];
	jQuery.each(array, function(index, value) {
		if(index == 0 ) {
			} else {
		var singlePlayerArray = [];
		singlePlayerArray[0] = ALLPLAYERS[index];
		singlePlayerArray[1] = value;
		totalPlayerArray.push(singlePlayerArray);
			}
		});
	return totalPlayerArray.sort(compare);
	}
function compare(a, b) {
	if(a[1] < b[1]) 
	return -1;
	if(a[1] > b[1])
	return 1;
	return 0;
	}
	
function getRecords() {
    $.ajax({
        url: "http://charlottechuckers.com/proto/php/getrecords.php",
        type: "GET",
        async: false,
        dataType: "json",

        success: function (json) {
            RECORDS = json;
			var tempRecords = [];
			for(i = 0; i < RECORDS.length;i++) {
				if(tempRecords[RECORDS[i][0]] == undefined) {
					var recs = [];
					tempRecords[RECORDS[i][0]] = recs;
					tempRecords[RECORDS[i][0]].push(RECORDS[i][1]);
					} else {
				tempRecords[RECORDS[i][0]].push(RECORDS[i][1]);
					}
            }
            HANDICAPS = (compileHandicaps(tempRecords));
        },
        error: function (xhr) {
        },
        complete: function (xhr, status) {}
    });
}

function compileHandicaps(array) {
	var records = [];
	jQuery.each(array, function(index, value) {
		if(index === 0) {return;}
		var tempRecord = [];
		var total = 0;
		if(value === undefined) {return;}
		for(i = 0; i < value.length; i++){
			total += parseInt(value[i]);
			}
		tempRecord[0] = ALLPLAYERS[index];
		tempRecord[1] = (total / value.length) + 6;
		records.push(tempRecord);
		});
		return records;
}
