var ALLPLAYERS;
var SCORECARDS;
var HANDICAPS;
var RECORDS;
var prevLocation = "";
var allPlayersAndScores;
var curScoreKeeper;
var curCard;
var curCardNumber;
var startingHole;
var playersOnCard;
var totalHolesLeft = 0;
var firstIsDone = 0;
var nextToGo = $('<div>');
var startingHoleComplete = 0;
var holePrepared = 0;
var curHole;
var unavailableHoles;

$(document).on('pagebeforeshow', '#index', function() {
    // Get allplayers //
    var signedUpPlayersPromise = Players.signedUp();
    var setUpScorecardsPromise = Scorecards.setUpCards();
    $.when(signedUpPlayersPromise, setUpScorecardsPromise).then(function(signedUpResult, scorecardsResult) {
        ALLPLAYERS = signedUpResult;
        SCORECARDS = scorecardsResult;
        //Check for stored Scorekeeper variable//
        if (localStorage.SCOREKEEPER) {
            curScoreKeeper = JSON.parse(localStorage.getItem("SCOREKEEPER"));
            var scorecardsLength = SCORECARDS.length;
            for (var i = 0; i < scorecardsLength; i++) {
                if (curScoreKeeper == SCORECARDS[i].player_id) {
                    curCard = SCORECARDS[i];
                    curCardNumber = i;
                    localStorage.setItem("CURRENTCARD", JSON.stringify(curCard));
                    localStorage.setItem("CURCARDNUMBER", JSON.stringify(curCardNumber));
                }
            }
            var checkForCard = CheckCardTable.pickStartHole();
            $.when(checkForCard).then(function (checkForCardResponse) {
            })
        }
    });

});
$(document).on('pagebeforeshow', '#playersPage', function () {
    if(localStorage.LASTHOLESCORES) {
        var lastHoleScores = JSON.parse(localStorage.getItem("LASTHOLESCORES"));
            prepareHolePage.prepare2(playersOnCard, lastHoleScores);
    } else
        prepareHolePage.prepare(playersOnCard);
});

var prepareHolePage = {
    prepare2: function (numPlayers, lastScores) {
        if (typeof curHole === "undefined") {
            curHole = startingHole;
            localStorage.setItem("CURRENTHOLE", JSON.stringify(curHole));
        }
        $('#headerHoleText').text("Hole " + curHole);
        var firstTee = $('#first2Tee');
        var secondTee = $('#second2Tee');
        var thirdTee = $('#third2Tee');
        var fourthTee = $('#fourth2Tee');


        var keepersLastScore = [{ ID:parseInt(curCard.player_id),SCORE:parseInt(lastScores.keeperscore)}];
        var player1LastScore = [{ ID:parseInt(curCard.player1),SCORE:parseInt(lastScores.player1)}];
        var player2LastScore = [{ ID:parseInt(curCard.player2),SCORE:parseInt(lastScores.player2)}];
        var player3LastScore = [{ ID:parseInt(curCard.player3),SCORE:parseInt(lastScores.player3)}];
        var player4LastScore = [{ ID:parseInt(curCard.player4),SCORE:parseInt(lastScores.player4)}];

        var lastScoreArray = [keepersLastScore,player1LastScore, player2LastScore, player3LastScore, player4LastScore];
        lastScoreArray = jQuery.map(lastScoreArray, function(value) {
            if(value.SCORE !== null) {
                return value;
            }
        });
        var sortedLastScoreArray = lastScoreArray.sort(compareLastScores);
            switch (numPlayers) {
            case 1:
                $('#first2Tee-button').html("<div style='text-align:center;'><a data-icon='grid' data-iconpos='right' data-role='button' href='javascript:confirmHole(" + curHole + ")'>Submit</a></div>").trigger('create');
                firstTee.find('h1').text(ALLPLAYERS[sortedLastScoreArray[0].ID]);
                break;
            case 2:
                $('#second2Tee-button').html("<div style='text-align:center;'><a data-icon='grid' data-iconpos='right' data-role='button' href='javascript:confirmHole(" + curHole + ")'>Submit</a></div>").trigger('create');
                firstTee.find('h1').text(ALLPLAYERS[sortedLastScoreArray[0].ID]);
                secondTee.find('h1').text(ALLPLAYERS[sortedLastScoreArray[1].ID]);
                break;
            case 3:
                $('#third2Tee-button').html("<div style='text-align:center;'><a data-icon='grid' data-iconpos='right' data-role='button' href='javascript:confirmHole(" + curHole + ")'>Submit</a></div>").trigger('create');
                firstTee.find('h1').text(ALLPLAYERS[sortedLastScoreArray[0].ID]);
                secondTee.find('h1').text(ALLPLAYERS[sortedLastScoreArray[1].ID]);
                thirdTee.find('h1').text(ALLPLAYERS[sortedLastScoreArray[2].ID]);
                break;
            case 4:
                $('#fourth2Tee-button').html("<div style='text-align:center;'><a data-icon='grid' data-iconpos='right' data-role='button' href='javascript:confirmHole(" + curHole + ")'>Submit</a></div>").trigger('create');
                firstTee.find('h1').text(ALLPLAYERS[sortedLastScoreArray[0].ID]);
                secondTee.find('h1').text(ALLPLAYERS[sortedLastScoreArray[1].ID]);
                thirdTee.find('h1').text(ALLPLAYERS[sortedLastScoreArray[2].ID]);
                fourthTee.find('h1').text(ALLPLAYERS[sortedLastScoreArray[3].ID]);
                break;
            case 5:
                var fifth2Tee = $('#fifth2Tee');
                fifth2Tee.find('a').attr('href', 'javascript:confirmHole(' + curHole + ')');
                $('#fifthTee-button').html("<div style='text-align:center;'><a data-icon='grid' data-iconpos='right' data-role='button' href='javascript:confirmHole(" + curHole + ")'>Submit</a></div>").trigger('create');
                firstTee.find('h1').text(ALLPLAYERS[sortedLastScoreArray[0].ID]);
                secondTee.find('h1').text(ALLPLAYERS[sortedLastScoreArray[1].ID]);
                thirdTee.find('h1').text(ALLPLAYERS[sortedLastScoreArray[2].ID]);
                fourthTee.find('h1').text(ALLPLAYERS[sortedLastScoreArray[3].ID]);
                fifth2Tee.find('h1').text(ALLPLAYERS[sortedLastScoreArray[4].ID]);
                break;
        }
    },
    prepare : function (numPlayers) {

    if (typeof curHole === "undefined") {
        curHole = startingHole;
        localStorage.setItem("CURRENTHOLE", JSON.stringify(curHole));
    }
    $('#headerHoleText').text("Hole " + curHole);
    var firstTee = $('#first2Tee');
    var secondTee = $('#second2Tee');
    var thirdTee = $('#third2Tee');
    var fourthTee = $('#fourth2Tee');
    switch (numPlayers) {
        case 1:
            $('#first2Tee-button').html("<div style='text-align:center;'><a data-icon='grid' data-iconpos='right' data-role='button' href='javascript:confirmHole(" + curHole + ")'>Submit</a></div>").trigger('create');
            firstTee.find('h1').text(ALLPLAYERS[SCORECARDS[curCardNumber].player_id]);
            break;
        case 2:
            $('#second2Tee-button').html("<div style='text-align:center;'><a data-icon='grid' data-iconpos='right' data-role='button' href='javascript:confirmHole(" + curHole + ")'>Submit</a></div>").trigger('create');
            firstTee.find('h1').text(ALLPLAYERS[SCORECARDS[curCardNumber].player_id]);
            secondTee.find('h1').text(ALLPLAYERS[SCORECARDS[curCardNumber].player1]);
            break;
        case 3:
            $('#third2Tee-button').html("<div style='text-align:center;'><a data-icon='grid' data-iconpos='right' data-role='button' href='javascript:confirmHole(" + curHole + ")'>Submit</a></div>").trigger('create');
            firstTee.find('h1').text(ALLPLAYERS[SCORECARDS[curCardNumber].player_id]);
            secondTee.find('h1').text(ALLPLAYERS[SCORECARDS[curCardNumber].player1]);
            thirdTee.find('h1').text(ALLPLAYERS[SCORECARDS[curCardNumber].player2]);
            break;
        case 4:
            $('#fourth2Tee-button').html("<div style='text-align:center;'><a data-icon='grid' data-iconpos='right' data-role='button' href='javascript:confirmHole(" + curHole + ")'>Submit</a></div>").trigger('create');
            firstTee.find('h1').text(ALLPLAYERS[SCORECARDS[curCardNumber].player_id]);
            secondTee.find('h1').text(ALLPLAYERS[SCORECARDS[curCardNumber].player1]);
            thirdTee.find('h1').text(ALLPLAYERS[SCORECARDS[curCardNumber].player2]);
            fourthTee.find('h1').text(ALLPLAYERS[SCORECARDS[curCardNumber].player3]);
            break;
        case 5:
            var fifth2Tee = $('#fifth2Tee');
            fifth2Tee.find('a').attr('href', 'javascript:confirmHole(' + curHole + ')');
            $('#fifthTee-button').html("<div style='text-align:center;'><a data-icon='grid' data-iconpos='right' data-role='button' href='javascript:confirmHole(" + curHole + ")'>Submit</a></div>").trigger('create');
            firstTee.find('h1').text(ALLPLAYERS[SCORECARDS[curCardNumber].player_id]);
            secondTee.find('h1').text(ALLPLAYERS[SCORECARDS[curCardNumber].player1]);
            thirdTee.find('h1').text(ALLPLAYERS[SCORECARDS[curCardNumber].player2]);
            fourthTee.find('h1').text(ALLPLAYERS[SCORECARDS[curCardNumber].player3]);
            fifth2Tee.find('h1').text(ALLPLAYERS[SCORECARDS[curCardNumber].player4]);
            break;
    }
    holePrepared = 1;
 }
};
// Promise to pull players;
var Players = {
    signedUp: function () {
        var promise = $.Deferred();
        $.ajax({
            url: 'http://charlottechuckers.com/proto/php/getallplayers.php',
            type: 'GET',
            dataType: 'json',
            success: function (json) {
                promise.resolve(json);

            },
            error: function () {
                var error = 'did not load players';
                promise.reject(error);
            }
        });
        return promise;
    }
};
// Promise to pull scorecards
var Scorecards = {
    setUpCards: function () {
        var promise = $.Deferred();
        $.ajax({
            url: 'http://charlottechuckers.com/proto/php/getscorecards.php',
            type: 'GET',
            dataType: "json",
            success: function (json) {
                promise.resolve(json);
            },
            error: function () {
                var error = 'did not load scorecards';
                promise.reject(error);
            }
        });
        return promise;
    }
};
/// DISPLAY ORIGINAL HOME ///
/// DISPLAY SCOREKEEPER SELECTION SCREEN
var scorekeeper = function () {
    var setUpScorecardsPromise = Scorecards.setUpCards();
    $.when(setUpScorecardsPromise).then(function (scorecardResult) {
        scorekeeperChoiceMenu(scorecardResult);
    });
};

var scorekeeperChoiceMenu = function (scorecardsJson) {
    SCORECARDS = scorecardsJson;
    prevLocation = 'home';
    var wrap = $('#contentWrap').empty();
    var scorecardsLength = SCORECARDS.length;
    var keeperString = '<ul data-role="listview" data-inset="true" id="keeperlist">';
    for (var i = 0; i < scorecardsLength; i++) {
        var keeperName = ALLPLAYERS[SCORECARDS[i].player_id];
        var card = SCORECARDS[i];
        keeperString += '<li><a href="javascript:keeperLogin(' + i + ')">' +
            '<h3>' + keeperName + '</h3>' +
            '<p>Players: ';
        var scorecardsILength = Object.keys(SCORECARDS[i]).length;
        for (var j = 0; j < scorecardsILength; j++) {
            var string = "player" + j;
            if (j === 0) keeperString += "";
            else if (card[string] === null) {
                keeperString = keeperString.substring(0, keeperString.length - 2);
                break;
            } else {
                keeperString += ALLPLAYERS[card[string]] + ', ';
            }
        }
        keeperString += '</p></a></li>';

    }
    keeperString += '</ul>';
    wrap.append(keeperString).trigger('create');
    $('#keeperlist').listview('refresh');
};
///// ADMIN LOGIN POPUP /////
var admin = function () {
    var adminLogin = $('#adminlogin').empty();
    var loginString = '<div data-role="fieldcontain">' +
        '<label data-inline="true" for="passwordinput"><h3>Insert Password</h3></label>' +
        '<input data-inline="true" type="password" name="passwordinput" id="passwordinput" value=""  />' +
        '<a data-inline="true" data-role="button" id="pwsubmit" href="javascript:checkAdminPW()">Submit</a>' +
        '</div>';
    adminLogin.append(loginString).trigger('create').popup('open');
};
var checkAdminPW = function () {
    var acceptablePw = "anderman";
    var givenPw = $('#passwordinput').val();
    if (acceptablePw == givenPw) {
        proceed2Admin();
    } else {
        alert("Incorrect Password");
        $('#adminlogin').popup('close');
    }
};
var proceed2Admin = function () {
    prevLocation = 'home';
    $(':mobile-pagecontainer').pagecontainer('change', 'admin.html', {
        transition: 'flip',
        changeHash: false,
        rel: 'external',
        ajax: false,
        reverse: true,
        showLoadMsg: true
    });
};
// clear week promise
    var Clearweek = {
        clearThem: function () {
            var numOfCards = SCORECARDS.length;
            var promise = $.Deferred();
            $.ajax({
                url: 'http://charlottechuckers.com/proto/php/admin/clearweek.php',
                type: 'POST',
                data: {
                    numofcards: numOfCards
                },
                dataType: "json",
                success: function () {
                    promise.resolve("Week Cleared");
                },
                error: function () {
                    var error = 'did not clear week';
                    promise.reject(error);
                }
            });
            return promise;
        }
    };
var clearWeek = function() {
    var getRecords = Records.pullHandicaps();
    $.when(getRecords).then(function(recordsResult) {
        alert(recordsResult);
        var pullAllCardsPromise = PullScorecards.pullAllCards();
        $.when(pullAllCardsPromise).then(function(pullallcardsResult) {
            alert(pullallcardsResult);

            var saveWeekPromise = Saveweek.saveThem();
            $.when(saveWeekPromise).then(function(saveweekResult) {
                alert(saveweekResult);
                    var clearWeekPromise = Clearweek.clearThem();
                        $.when(clearWeekPromise).then(function(clearweekResult) {
                            alert(clearweekResult);
        })
    })
})
    });
};
// save week promise
var Saveweek = {
    saveThem: function () {
        var scores2Save = allPlayersAndScores;
        jQuery.map(scores2Save, function (value, index) {
                var newArray = [];
                var handicapsLength = HANDICAPS.length;
                for (var i = 0; i < handicapsLength; i++) {
                    if (typeof(value) == "undefined") {

                        return;
                    }
                    if (ALLPLAYERS[index] === HANDICAPS[i][0]) {
                        newArray.push(value);
                        newArray.push(Math.round(HANDICAPS[i][1]));
                        scores2Save[index] = newArray;
                    }
                }
            }
        );
        var promise = $.Deferred();
        $.ajax({
            url: 'http://charlottechuckers.com/proto/php/admin/savescores.php',
            type: 'POST',
            data: {
                scores2save: scores2Save
            },
            dataType: "json",
            success: function () {
                promise.resolve("Week Saved");
            },
            error: function () {
                var error = 'did not save week';
                promise.reject(error);
            }
        });
        return promise;
    }
};
// get records promise
var Records = {
    pullHandicaps: function () {
        var promise = $.Deferred();
        $.ajax({
            url: 'http://charlottechuckers.com/proto/php/getrecords.php',
            type: 'GET',
            dataType: "json",
            success: function (json) {
                RECORDS = json;
                var tempRecords = [];
                var recordsLength = RECORDS.length;
                for (var i = 0; i < recordsLength; i++) {
                    if (tempRecords[RECORDS[i][0]] == undefined) {
                        tempRecords[RECORDS[i][0]] = [];
                        tempRecords[RECORDS[i][0]].push(RECORDS[i][1]);
                    } else {
                        tempRecords[RECORDS[i][0]].push(RECORDS[i][1]);
                    }
                }
                console.log(tempRecords);
                HANDICAPS = (compileHandicaps(tempRecords));
                promise.resolve("Records pulled");
            },
            error: function () {
                var error = 'did not pull Records ';
                promise.reject(error);
            }
        });
        return promise;
    }
};
// pull scorecards promise
var PullScorecards = {
    pullAllCards: function () {
        var promise = $.Deferred();
        $.ajax({
            url: 'http://charlottechuckers.com/proto/php/getallscorecards.php',
            type: 'GET',
            dataType: "json",
            data: {number: SCORECARDS.length},
            success: function (json) {
                var updatedScore = [];

                jQuery.map(json, function (n, i) {
                    var eachOne = [];
                    jQuery.map(n, function (y, j) {
                        var array = [];

                        array[0] = 0;
                        array[1] = 0;
                        array[2] = 0;
                        array[3] = 0;
                        array[4] = 0;

                        jQuery.map(y, function (q, p) {
                            if (p == 'player_id') {
                                array[0] += parseInt(q);
                            } else if (p == 'player1') {
                                array[1] += parseInt(q);
                            } else if (p == 'player2') {
                                array[2] += parseInt(q);
                            } else if (p == 'player3') {
                                array[3] += parseInt(q);
                            } else if (p == 'player4') {
                                array[4] += parseInt(q);
                            }

                            eachOne[j] = array;
                        });
                        updatedScore[i] = eachOne;
                    });
                });
                allPlayersAndScores = [];
                console.log(SCORECARDS);
                jQuery.map(SCORECARDS, function (n, i) {
                    jQuery.map(n, function (j, y) {
                        var tally = 0;
                        var count = 0;
                        if (y === 'player_id') {
                            var updatedScoreILength = updatedScore[i].length;
                            for (var g = 0; g < updatedScoreILength; g++) {
                                tally += updatedScore[i][g][0];
                                count++;
                            }

                            allPlayersAndScores[n.player_id] = (tally - (count * 3));
                        }
                        if (y === 'player1') {
                            var updatedScoreILength = updatedScore[i].length;
                            for (var g = 0; g < updatedScoreILength; g++) {
                                tally += updatedScore[i][g][1];
                                count++;
                            }
                            if (ALLPLAYERS[n.player1] === undefined) {
                                return;
                            }

                            allPlayersAndScores[n.player1] = (tally - (count * 3));
                        }
                        if (y === 'player2') {
                            var updatedScoreILength = updatedScore[i].length;
                            for (var g = 0; g < updatedScoreILength; g++) {
                                tally += updatedScore[i][g][2];
                                count++;
                            }
                            if (ALLPLAYERS[n.player2] === undefined) {
                                return;
                            }

                            allPlayersAndScores[n.player2] = (tally - (count * 3));
                        }
                        if (y === 'player3') {
                            var updatedScoreILength = updatedScore[i].length;
                            for (var g = 0; g < updatedScoreILength; g++) {
                                tally += updatedScore[i][g][3];
                                count++;
                            }
                            if (ALLPLAYERS[n.player3] === undefined) {
                                return;
                            }

                            allPlayersAndScores[n.player3] = (tally - (count * 3));
                        }
                        if (y === 'player4') {
                            var updatedScoreILength = updatedScore[i].length;
                            for (var g = 0; g < updatedScoreILength; g++) {
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
                promise.resolve("ALL CARDS pulled");
            },
            error: function () {
                var error = 'did not pull Records ';
                promise.reject(error);
            }
        });
        return promise;
    }
};
var compileHandicaps = function (array) {
    var records = [];
    jQuery.each(array, function (index, value) {
        if (index === 0) {
            return;
        }
        var valueLength = value.length;
        var tempRecord = [];
        var total = 0;
        if (value === undefined) {
            return;
        }
        for (var i = 0; i < valueLength; i++) {
            total += parseInt(value[i]);
        }
        tempRecord[0] = ALLPLAYERS[index];
        tempRecord[1] = (total / valueLength) + 6;
        records.push(tempRecord);
    });
    return records;
};
// SCORE KEEPER LOGIN
var keeperLogin = function (scorecardid) {
    var keepLogin = $('#login').empty();
    keepLogin.empty();
    var loginString;
    var id = SCORECARDS[scorecardid].player_id;

    loginString = '<div data-role="fieldcontain">' +
        '<label data-inline="true" for="passwordinput"><h3>Insert Password</h3></label>' +
        '<input data-inline="true" type="password" name="passwordinput" id="passwordinput" value=""  />' +
        '<a data-inline="true" data-role="button" id="pwsubmit" href="javascript:checkPW(' + scorecardid + ')">Submit</a>' +
        '</div>';
    keepLogin.append(loginString).trigger('create').popup('open');
};
var checkPW = function (scorecardid) {
    var acceptablePw = SCORECARDS[scorecardid].player_id;
    var givenPw = $('#passwordinput').val();
    if (acceptablePw == givenPw) {
        localStorage.setItem("SCOREKEEPER", JSON.stringify(acceptablePw));
        curScoreKeeper = acceptablePw;
        var scorecardsLength = SCORECARDS.length;
        for (var i = 0; i < scorecardsLength; i++) {
            if (curScoreKeeper == SCORECARDS[i].player_id) {
                curCard = SCORECARDS[i];
                curCardNumber = i;
            }
        }
        $('#login').popup('close');
        var checkForCard = CheckCardTable.pickStartHole();
        $.when(checkForCard).then(function (checkForCardResponse) {
        })
    } else {
        alert("Incorrect Password");
        $('#login').popup('close');
    }
};

///Check for Card Table
var CheckCardTable = {
    pickStartHole: function () {
        var startingHoleSearch = StartingHole.startingHole();
        $.when(startingHoleSearch).then(function (startingHoleResult) {
            if (startingHoleResult == "EXISTS") {
                cardLength(curCardNumber);
                if (pullCard(curCardNumber) == false) {
                    $(":mobile-pagecontainer").pagecontainer("change", "index.html", { });
                    return;
                }
                if (typeof(curHole) == "undefined") {
                    curHole = startingHole;
                }
                var containerPage = $(':mobile-pagecontainer');
                containerPage.pagecontainer("change", "holes/hole.html", { reload: true });



            } else {
                var contentWrap = $('#contentWrap');
                var promptStartingHole = PromptStartingHole.promptStart();
                $.when(promptStartingHole).then(function (promptResult) {
                    unavailableHoles = promptResult;
                    contentWrap.empty();
                    var string = '<ul data-role="listview" data-inset="true">';
                    for (var i = 1; i < 19; i++) {
                        var unavailableHolesLength = unavailableHoles.length;
                        for (var j = 0; j < unavailableHolesLength; j++) {
                            if (i == parseInt(unavailableHoles[j])) {
                                string += '<li class="ui-disabled"><a href="javascript:continueCard(' + (i) + ')">Hole ' + (i) + '</a></li>';
                                i++;
                                if (unavailableHoles[j] == 18) {
                                    string += '</ul>';
                                    $('#contentWrap').append(string).trigger('create');
                                    return;
                                }
                            }

                        }
                        string += '<li><a href="javascript:continueCard(' + (i) + ')">Hole ' + (i) + '</a></li>';
                    }
                    string += '</ul>';
                    contentWrap.append(string).trigger('create');
                })
            }
        });

        var promise = $.Deferred();
        $.ajax({
            url: "http://charlottechuckers.com/proto/php/cardexists.php",
            type: "GET",
            data: {
                cardnumber: curCardNumber
            },
            dataType: "json",
            success: function (json) {
                promise.resolve(json);
            }
        });
        return promise;
    }
};
///GET STARTING HOLE
var StartingHole = {
    startingHole: function () {
        var promise = $.Deferred();
        $.ajax({
            url: 'http://charlottechuckers.com/proto/php/getstartinghole.php',
            type: 'POST',
            data: {
                keeper: curScoreKeeper
            },
            dataType: "json",
            success: function (json) {
                if (json[0] === null) {
                    promise.resolve("NULL");
                } else {
                    startingHole = parseInt(json[0]);
                    localStorage.setItem("STARTINGHOLE", JSON.stringify(startingHole));
                    promise.resolve("EXISTS");
                }

            },
            error: function () {
                var error = 'did not find starting hole';
                promise.reject(error);
            }
        });
        return promise;
    }
};
var cardLength = function (cardNum) {
    var theCard = SCORECARDS[cardNum];
    if (theCard.player1 == null) {
        playersOnCard = 1;
    } else if (theCard.player2 == null) {
        playersOnCard = 2;
    } else if (theCard.player3 == null) {
        playersOnCard = 3;
    } else if (theCard.player4 == null) {
        playersOnCard = 4;
    } else {
        playersOnCard = 5;
    }
    localStorage.setItem("PLAYERSONCARD", JSON.stringify(playersOnCard));
};
var pullCard = function (cardNumber) {
    $.ajax({
        url: "http://charlottechuckers.com/proto/php/pullexistingcard.php",
        type: "GET",
        data: {
            cardnumba: cardNumber
        },
        dataType: "json",
        async: false,
        success: function (json) {
            var lastStatus;
            var count = 0;
            for (var i = 1; i < 19; i++) {
                if (json[i] == 0 && json[i - 1] == 1) {
                    lastStatus = i;
                } else if (json[i] == 1) {
                    count++;
                } else if (json[1] == 0 && json[18] == 1) {
                    lastStatus = 1;
                }
            }
            totalHolesLeft = 18 - count;
            curHole = lastStatus;
            if(typeof curHole === "undefined") {

            } else
            localStorage.setItem("CURRENTHOLE", JSON.stringify(curHole));
            if (totalHolesLeft == 0) {
                alert("Round completed already.");
                userLogout();
            }
        }});
};
/////PROMPT STARTING HOLE //////
var PromptStartingHole = {
    promptStart: function () {
        var promise = $.Deferred();
        var unavailableHoles = [];
        $.ajax({
            url: 'http://charlottechuckers.com/proto/php/getstartingholes.php',
            type: 'GET',
            dataType: "json",
            success: function (json) {
                unavailableHoles = parseInt(json);
                promise.resolve(json);
            },
            error: function () {
            }
        });
        return promise;
    }
};
///Continue card
var continueCard = function (hole) {
    startingHole = hole;
    localStorage.setItem("STARTINGHOLE", JSON.stringify(startingHole));
    var createCardPromise = Createcard.create(hole);
    $.when(createCardPromise).then(function () {
        cardLength(curCardNumber);
        totalHolesLeft = 18;
        localStorage.setItem("HOLESREMAINING", JSON.stringify(totalHolesLeft));
        var containerPage = $(':mobile-pagecontainer');
        containerPage.pagecontainer("change", "holes/hole.html", { });

        $('#index').remove();
    });
};
// Create card
var Createcard = {
    create: function (hole) {
        var promise = $.Deferred();
        $.ajax({
            url: "http://charlottechuckers.com/proto/php/createCardEntry.php",
            type: "POST",
            data: {
                keeper: curScoreKeeper,
                cardnumber: curCardNumber,
                startinghole: hole
            },
            dataType: "json",
            success: function (json) {
                promise.resolve(json);
            },
            error: function () {
            }
        });
        return promise;
    }
};
////// Next Player
var nextPlayer = function () {
    if (firstIsDone == 0) {
        var next = $('#playersPage').find('div:hidden:first').slideDown('fast');
        next.prev().slideUp('fast');
        firstIsDone = 1;
        nextToGo = next;
    } else {
        nextToGo.next().slideDown('fast');
        nextToGo.slideUp('fast');
        nextToGo = nextToGo.next();
    }
};

var confirmHole = function (hole) {

    var firstDiv = $('#first2Tee');
    var secondDiv = $('#second2Tee');
    var thirdDiv = $('#third2Tee');
    var forthDiv = $('#fourth2Tee');
    var fifthDiv = $('#fifth2Tee');
    var first = firstDiv.find('input').val();
    var second = secondDiv.find('input').val();
    var third = thirdDiv.find('input').val();
    var fourth = forthDiv.find('input').val();
    var fifth = fifthDiv.find('input').val();

    var confirmString = "<div><ul data-role='listview' data-inset='true' data-count-theme='b' data-divider-theme='a'>";

    switch (playersOnCard) {
        case 1:
            confirmString += "<li id='dialogKeeperScore'><h2>" + firstDiv.find('h1').text() + "</h2><input type='number' data-clear-btn='false' pattern='[0-9]*'  value='" + first + "'></li>";
            break;
        case 2:
            confirmString += "<li id='dialogKeeperScore'><h2>" + firstDiv.find('h1').text() + "</h2><input type='number' data-clear-btn='false' pattern='[0-9]*'  value='" + first + "'></li>";
            confirmString += "<li id='dialogplayer1Score'><h2>" + secondDiv.find('h1').text() + "</h2><input type='number' data-clear-btn='false' pattern='[0-9]*' value='" + second + "'></li>";
            break;
        case 3:
            confirmString += "<li id='dialogKeeperScore'><h2>" + firstDiv.find('h1').text() + "</h2><input type='number' data-clear-btn='false' pattern='[0-9]*' value='" + first + "'></li>";
            confirmString += "<li id='dialogplayer1Score'><h2>" + secondDiv.find('h1').text() + "</h2><input type='number' data-clear-btn='false' pattern='[0-9]*' value='" + second + "'></li>";
            confirmString += "<li id='dialogplayer2Score'><h2>" + thirdDiv.find('h1').text() + "</h2><input type='number' data-clear-btn='false' pattern='[0-9]*' value='" + third + "'></li>";
            break;
        case 4:
            confirmString += "<li id='dialogKeeperScore'><h2>" + firstDiv.find('h1').text() + "</h2><input type='number' data-clear-btn='false' pattern='[0-9]*' value='" + first + "'></li>";
            confirmString += "<li id='dialogplayer1Score'><h2>" + secondDiv.find('h1').text() + "</h2><input type='number' data-clear-btn='false' pattern='[0-9]*' value='" + second + "'></li>";
            confirmString += "<li id='dialogplayer2Score'><h2>" + thirdDiv.find('h1').text() + "</h2><input type='number' data-clear-btn='false' pattern='[0-9]*' value='" + third + "'></li>";
            confirmString += "<li id='dialogplayer3Score'><h2>" + forthDiv.find('h1').text() + "</h2><input type='number' data-clear-btn='false' pattern='[0-9]*' value='" + fourth + "'></li>";
            break;
        case 5:
            confirmString += "<li id='dialogKeeperScore'><h2>" + firstDiv.find('h1').text() + "</h2><input type='number' data-clear-btn='false' pattern='[0-9]*' value='" + first + "'></li>";
            confirmString += "<li id='dialogplayer1Score'><h2>" + secondDiv.find('h1').text() + "</h2><input type='number' data-clear-btn='false' pattern='[0-9]*' value='" + second + "'></li>";
            confirmString += "<li id='dialogplayer2Score'><h2>" + thirdDiv.find('h1').text() + "</h2><input type='number' data-clear-btn='false' pattern='[0-9]*' value='" + third + "'></li>";
            confirmString += "<li id='dialogplayer3Score'><h2>" + forthDiv.find('h1').text() + "</h2><input type='number' data-clear-btn='false' pattern='[0-9]*' value='" + fourth + "'></li>";
            confirmString += "<li id='dialogplayer4Score' ><h2>" + fifthDiv.find('h1').text() + "</h2><input type='number' data-clear-btn='false' pattern='[0-9]*' value='" + fifth + "'></li>";
            break;
    }

    confirmString += '<ul><div data-role="fieldcontain">' +
        '<a data-inline="true" data-role="button" id="submitOnDialog" href="javascript:confirmed(' + hole + ')">Confirm</a>' +
        '<a data-inline="true" data-role="button" id="refreshPage" href="javascript:resetEntries(' + playersOnCard + ')">Reset</a>' +
        '</div></div>';
    $('#confirmDialog').append(confirmString).trigger('create').popup('open');
};
function resetEntries(num) {
    $('#confirmDialog').popup('close').empty();
    $('#playersPage').find('div:hidden:first').slideDown('fast');
    if(num == 2) {
        $('#second2Tee').toggle();
    } else if(num == 3) {
        $('#third2Tee').toggle();
    } else if (num == 4) {
        $('#fourth2Tee').toggle();
    } else {
        $('#fifth2Tee').toggle();
    }
    firstIsDone = 0;
}
var confirmed = function (hole) {
    $('#confirmDialog').popup('close');

    submitHole(hole);
};

var submitHole = function (hole) {
    var scorekeepersScore;
    var player1Score;
    var player2Score;
    var player3Score;
    var player4Score;
    ///line up proper scores with ordered players

    var firstDiv = $('#dialogKeeperScore');
    if (firstDiv.find('h2').text() == ALLPLAYERS[SCORECARDS[curCardNumber].player_id]) {
        scorekeepersScore = firstDiv.find('input').val();
    } else if (firstDiv.find('h2').text() == ALLPLAYERS[SCORECARDS[curCardNumber].player1]) {
        player1Score = firstDiv.find('input').val();
    } else if (firstDiv.find('h2').text() == ALLPLAYERS[SCORECARDS[curCardNumber].player2]) {
        player2Score = firstDiv.find('input').val();
    } else if (firstDiv.find('h2').text() == ALLPLAYERS[SCORECARDS[curCardNumber].player3]) {
        player3Score = firstDiv.find('input').val();
    } else if (firstDiv.find('h2').text() == ALLPLAYERS[SCORECARDS[curCardNumber].player4]) {
        player4Score = firstDiv.find('input').val();
    }
    var secondDiv = $('#dialogplayer1Score');
    if (secondDiv.find('h2').text() == ALLPLAYERS[SCORECARDS[curCardNumber].player_id]) {
        scorekeepersScore = secondDiv.find('input').val();
    } else if (secondDiv.find('h2').text() == ALLPLAYERS[SCORECARDS[curCardNumber].player1]) {
        player1Score = secondDiv.find('input').val();
    } else if (secondDiv.find('h2').text() == ALLPLAYERS[SCORECARDS[curCardNumber].player2]) {
        player2Score = secondDiv.find('input').val();
    } else if (secondDiv.find('h2').text() == ALLPLAYERS[SCORECARDS[curCardNumber].player3]) {
        player3Score = secondDiv.find('input').val();
    } else if (secondDiv.find('h2').text() == ALLPLAYERS[SCORECARDS[curCardNumber].player4]) {
        player4Score = secondDiv.find('input').val();
    }
    var thirdDiv = $('#dialogplayer2Score');
    if (thirdDiv.find('h2').text() == ALLPLAYERS[SCORECARDS[curCardNumber].player_id]) {
        scorekeepersScore = thirdDiv.find('input').val();
    } else if (thirdDiv.find('h2').text() == ALLPLAYERS[SCORECARDS[curCardNumber].player1]) {
        player1Score = thirdDiv.find('input').val();
    } else if (thirdDiv.find('h2').text() == ALLPLAYERS[SCORECARDS[curCardNumber].player2]) {
        player2Score = thirdDiv.find('input').val();
    } else if (thirdDiv.find('h2').text() == ALLPLAYERS[SCORECARDS[curCardNumber].player3]) {
        player3Score = thirdDiv.find('input').val();
    } else if (thirdDiv.find('h2').text() == ALLPLAYERS[SCORECARDS[curCardNumber].player4]) {
        player4Score = thirdDiv.find('input').val();
    }
    var forthDiv = $('#dialogplayer3Score');
    if (forthDiv.find('h2').text() == ALLPLAYERS[SCORECARDS[curCardNumber].player_id]) {
        scorekeepersScore = forthDiv.find('input').val();
    } else if (forthDiv.find('h2').text() == ALLPLAYERS[SCORECARDS[curCardNumber].player1]) {
        player1Score = forthDiv.find('input').val();
    } else if (forthDiv.find('h2').text() == ALLPLAYERS[SCORECARDS[curCardNumber].player2]) {
        player2Score = forthDiv.find('input').val();
    } else if (forthDiv.find('h2').text() == ALLPLAYERS[SCORECARDS[curCardNumber].player3]) {
        player3Score = forthDiv.find('input').val();
    } else if (forthDiv.find('h2').text() == ALLPLAYERS[SCORECARDS[curCardNumber].player4]) {
        player4Score = forthDiv.find('input').val();
    }
    var fifthDiv = $('#dialogplayer4Score');
    if (fifthDiv.find('h2').text() == ALLPLAYERS[SCORECARDS[curCardNumber].player_id]) {
        scorekeepersScore = fifthDiv.find('input').val();
    } else if (fifthDiv.find('h2').text() == ALLPLAYERS[SCORECARDS[curCardNumber].player1]) {
        player1Score = fifthDiv.find('input').val();
    } else if (fifthDiv.find('h2').text() == ALLPLAYERS[SCORECARDS[curCardNumber].player2]) {
        player2Score = fifthDiv.find('input').val();
    } else if (fifthDiv.find('h2').text() == ALLPLAYERS[SCORECARDS[curCardNumber].player3]) {
        player3Score = fifthDiv.find('input').val();
    } else if (fifthDiv.find('h2').text() == ALLPLAYERS[SCORECARDS[curCardNumber].player4]) {
        player4Score = fifthDiv.find('input').val();
    }
    // Pull updated scores from Dialog

    $.ajax({
        url: "http://charlottechuckers.com/proto/php/submitHole.php",
        type: "POST",
        data: {
            thehole: hole,
            cardnumber: curCardNumber,
            keeperscore: scorekeepersScore,
            player1: player1Score,
            player2: player2Score,
            player3: player3Score,
            player4: player4Score
        },
        dataType: "json",
        async: false,
        success: function () {
            $('#playersPage').remove();
            totalHolesLeft--;
            localStorage.setItem("HOLESREMAINING", JSON.stringify(totalHolesLeft));
            var lastHoleScores = {
                thehole: hole,
                keeperscore: scorekeepersScore,
                player1: player1Score,
                player2: player2Score,
                player3: player3Score,
                player4: player4Score
            };
            localStorage.setItem("LASTHOLESCORES", JSON.stringify(lastHoleScores));
            nextHole(hole);

        }});
};
var nextHole = function (hole) {
    if (totalHolesLeft == 0) {
        wipeVariables();
        window.location.href = '../index.html';
    } else {
        if (startingHole = hole) {
            startingHoleComplete = 1;
        }
        if (hole == 18) {
            hole = 1;
        } else {
            hole++;
        }
        curHole = hole;
        localStorage.setItem("CURRENTHOLE", JSON.stringify(curHole));
        $('#submitOnDialog').empty();
        var containerPage = $(':mobile-pagecontainer');
        containerPage.pagecontainer("change", "hole.html", { });
        firstIsDone = 0;
    }
};
var wipeVariables = function () {
    firstIsDone = 0;
    playersOnCard = 0;
    startingHoleComplete = 0;
    curHole = 0;
    totalHolesLeft = 0;
};
var userLogout = function() {
    if(localStorage.SCOREKEEPER) {
        localStorage.clear();
        window.location = "http://charlottechuckers.com/phonegapProto/index.html";
    }
};
function compareLastScores(a, b) {
    if(a.SCORE < b.SCORE)
        return -1;
    if(a.SCORE > b.SCORE)
        return 1;

    else
            return 0;
}
