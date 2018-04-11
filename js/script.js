$(document).ready(function() {
	$('#settingsGrid').hide();
	// get JSON data
	$.getJSON("civData.json", function (data) {

        numPlayers = 3;
        numRandoms = 3;
        numCivs = 34;

        civs = data.civs;
        vanillaCivs = [];
        rafCivs = [];
        dlcCivs = [];

        // Populate civ version arrays
        for(var i = 0; i < numCivs; i++) {
            switch (civs[i].expansion) {
                case 'vanilla':
                    vanillaCivs.push(civs[i]);
                    break;

                case 'raf':
                    rafCivs.push(civs[i]);
                    break;

                case 'dlc':
                    dlcCivs.push(civs[i]);
                    break;
                
                case 'default':
                    break;
            }
        }
        console.log(vanillaCivs);
        console.log(rafCivs);
        console.log(dlcCivs);

        $('#numPlayersBtn').click(function() {

            $('#settingsGrid').show();
            
            if (typeof $('#numPlayers').val() !== 'undefined' && $('#numPlayers').val() > 0 && $('#numPlayers').val() < 13) {

                numPlayers = $('#numPlayers').val();

            } else {
                alert("Number of players must be 1 - 12. The value will default to 3 otherwise.");
            }

            // Check if numRandoms is undefined or 0. Will default to 3.
            if (typeof $('#numRandoms').val() !== 'undefined' && $('#numRandoms').val() > 0 && $('#numRandoms').val() < 6) {
                numRandoms = $('#numRandoms').val();
            } else {
                alert("Number of randoms must be 1 - 6. The value will default to 3 otherwise (Or 2 if 12 players).");
            }        
            
            $('#players').html('<h5 class="col-12">Enter player names (Optional): </h5>' +
                                '<form action="/">'
                            );

            for (var i = 0; i < numPlayers; i++) {
                $('#players').append('<div class="col-12 col-lg-6 mt-2"><label class="pr-2" for="player' + parseInt(i+1) + '">Player ' + parseInt(i+1) + ': </label><input id="p'+i+'" type="text"></div>');
            }

            $('#players').append('<button id="randomize" type="button" class="col-12 btn btn-info mt-2">Randomize</button></form>');

            for (var i = 0; i < numCivs; i++) {
                $('#allCivs').append(
                    '<div class="col-12 col-md-6 col-lg-4 col-xl-3" style="display: inline-block;">' +
                        '<input type="checkbox" class="" id="' + civs[i].name + '">' +
                        '<label class="pl-1" for="' + civs[i].name + '">' + civs[i].name + '</label>' +
                    '</div>'
                );
            }

            
        });

        $('body').on('click', '#randomize', function() {

            allRandoms = [];
            rolls = [];      
            civsUsed = [];
            civCount = 0;

            for (var i = 0; i < numCivs; i++) {
                if ( $('#' + civs[i].name).prop("checked")) {
                    civsUsed.push(civs[i]);
                    civCount++;
                }
            }
            
            if (civCount >= (numPlayers * numRandoms)) {

                for (var i = 0; i < numPlayers; i++){
                    randoms = [];
                    for(var j = 0; j < numRandoms; j++) {
                        //console.log("Civ " + j);
                        do {

                            var roll = Math.floor(Math.random() * civCount);               
                            //console.log("Roll: " + roll);      

                        } while (rolls.includes(roll));

                        rolls.push(roll);
                        //console.log("Rolls: " + rolls);
                        var civName = civsUsed[roll].name;
                        randoms.push(civName);
                    }

                    allRandoms[i] = randoms;
                }

                console.log("All Randoms: ");
                console.log(allRandoms);

                //Reset randomsgrid
                $('#randomsGrid').html('');
                for(var i = 0; i < numPlayers; i++) {

                    $('#randomsGrid').append(
                        '<div class="col-3 text-info">' +
                            '<h4 id="p' + i + 'name"></h4>' +
                            '<ul id="p' + i + 'randoms"></ul>'+
                        '</div>'
                    );

                    if($('#p' + i + '').val() != '') {
                        console.log($('#p' + i + '').val())
                        $('#p' + i + 'name').html(
                            $('#p' + i + '').val()
                        ); 
                    } else {
                        console.log("undefined");
                        $('#p' + i + 'name').html("Player " + parseInt(i+1));
                    }

                    for(var random in allRandoms[i]) {
                        //console.log(allRandoms[i][random]);
                        $('#p' + i + 'randoms').append(
                            '<li>'+
                                allRandoms[i][random] +
                            '</li>'
                        );
                    }
                    
                }
            } else {

                alert("Number of civs requested exceeded the number of civs selected. Please change the values and try again");
            }
        });
        
    });
});


versionSelect = function(version) {
    switch(version) {
        case 'vanilla':
            for (var civ in vanillaCivs) {              
                $('#' + vanillaCivs[civ].name).prop("checked", ! $('#' + vanillaCivs[civ].name).prop("checked"));    
            }
            break;

        case 'raf':
            for (var civ in rafCivs) {
                $('#' + rafCivs[civ].name).prop("checked", ! $('#' + rafCivs[civ].name).prop("checked")); 
            }
            break;

        case 'dlc':
            for (var civ in dlcCivs) {
                $('#' + dlcCivs[civ].name).prop("checked", ! $('#' + dlcCivs[civ].name).prop("checked")); 
            }
            break;
    }
}