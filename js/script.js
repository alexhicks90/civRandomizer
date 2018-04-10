$(document).ready(function() {
	
	// get JSON data
	$.getJSON("civData.json", function (data) {
        civs = data.civs;
        numplayers = 3;
        numRandoms = 3;

        $('#numPlayersBtn').click(function() {
            numPlayers = $('#numPlayers').val();

            // Check if numRandoms is undefined or 0. Will default to 3.
            if (typeof $('#numRandoms').val() !== 'undefined' && $('#numRandoms').val() != 0) {
                numRandoms = $('#numRandoms').val();
            }           
            
            $('#players').html('<form action="/">');

            for (var i = 0; i < numPlayers; i++) {
                $('#players').append('<div class="col-4 mt-2"><label for="player' + parseInt(i+1) + '">Player ' + parseInt(i+1) + ': </label><input id="p'+i+'" class="ml-2" type="text"></div><div class="col-8"></div>');
            }

            $('#players').append('<button id="randomize" type="button">Randomize</button></form>');
        });

        $('body').on('click', '#randomize', function() {

            numCivs = 34;    
            allRandoms = [];
            rolls = [];

            for (var i = 0; i < numPlayers; i++){
                randoms = [];
                for(var j = 0; j < numRandoms; j++) {
                    //console.log("Civ " + j);
                    do {

                        var roll = Math.floor(Math.random() * numCivs);               
                        //console.log("Roll: " + roll);      

                    } while (rolls.includes(roll));

                    rolls.push(roll);
                    //console.log("Rolls: " + rolls);
                    var civName = civs[roll].name;
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
                    '<div class="col-3 text-info bg-warning">' +
                        '<h4>' + $('#p' + i + '').val() + '</h4>' +
                        '<ul id="p' + i + 'randoms"></ul>'+
                    '</div>'
                );

                for(var random in allRandoms[i]) {
                    //console.log(allRandoms[i][random]);
                    $('#p' + i + 'randoms').append(
                        '<li>'+
                            allRandoms[i][random] +
                        '</li>'
                    );
                }
                
            }
        });
        
    });
});