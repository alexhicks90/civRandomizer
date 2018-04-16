$(document).ready(function() {

	$('#settingsGrid').hide();
	
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
                        '<input type="checkbox" class="" id="' + civs[i].name + '" checked>' +
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

                        do {
                            var roll = Math.floor(Math.random() * civCount);       

                        } while (rolls.includes(roll));

                        rolls.push(roll);
                        var civName = civsUsed[roll].name;
                        randoms.push(civName);
                    }

                    allRandoms[i] = randoms;
                }

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
                        $('#p' + i + 'name').html(
                            $('#p' + i + '').val()
                        ); 
                    } else {
                        $('#p' + i + 'name').html("Player " + parseInt(i+1));
                    }

                    for(var random in allRandoms[i]) {
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

dlcCount = 8;

versionSelect = function(version) {

    var civsSelected = [];
    
    switch(version) {

        case 'vanilla':
            civsSelected = vanillaCivs;
            break;
        
        case 'raf':
            civsSelected = rafCivs;
            break;

        case 'dlc':
            civsSelected = dlcCivs;
            for (var civ in civsSelected) {      
                if ($('#' + version).prop("checked")) {
                    $('#' + civsSelected[civ].dlcPack).prop("checked", true); 
                } else {
                    $('#' + civsSelected[civ].dlcPack).prop("checked", false); 
                }       
            }

            if ($('#' + version).prop("checked")) {
                dlcCount = 8;
            } else {
                dlcCount = 0;
            }
            break;
   
        case 'aus':
            civsSelected = [dlcCivs[0]];
            dlcToggle();
            break;
        case 'azt':
            civsSelected = [dlcCivs[1]];
            dlcToggle();
            break;
        case 'pol':
            civsSelected = [dlcCivs[7]];
            dlcToggle();
            break;
        case 'kai':
            civsSelected = [dlcCivs[3], dlcCivs[2]];
            dlcToggle();
            break;
        case 'pam':
            civsSelected = [dlcCivs[6], dlcCivs[4]];
            dlcToggle();
            break;
        case 'nub':
            civsSelected = [dlcCivs[5]];
            dlcToggle();
            break;

        case 'default':
            console.log("This shouldn't happen");
            break;
    }
    
    for (var civ in civsSelected) {      
        if ($('#' + version).prop("checked")) {
            $('#' + civsSelected[civ].name).prop("checked", true); 
        } else {
            $('#' + civsSelected[civ].name).prop("checked", false); 
        }          
    }
    
    function dlcToggle() {
        
        if ($('#' + version).prop("checked")) {
            for (var civ in civsSelected) {
                dlcCount++;
            }

            if(dlcCount >= 8){
                $('#dlc').prop("checked", true); 
            }
            
        } else {
            for (var civ in civsSelected) {
                dlcCount--;
            } 
     
            $('#dlc').prop("checked", false);           
        } 
    }

}