$(document).ready(function() {

    $('#settingsGrid').hide();
    $('#randomizeContainer').hide();
	
	$.getJSON("civData.json", function (data) {

        numPlayers = 3;
        numRandoms = 3;
<<<<<<< HEAD
        numCivs = 42;
=======
        numCivs = 48;
>>>>>>> testing

        civs = data.civs;
        vanillaCivs = [];
        rafCivs = [];
        dlcCivs = [];
        gsCivs = [];

        // Populate civ version arrays
        for(var i = 0; i < numCivs; i++) {
            switch (civs[i].expansion) {
                case 'vanilla':
                    vanillaCivs.push(civs[i]);
                    break;

                case 'raf':
                    rafCivs.push(civs[i]);
                    break;
                
                case 'gs':
                    gsCivs.push(civs[i]);
                    break;

                case 'dlc':
                    dlcCivs.push(civs[i]);
                    console.log("DLC Civ: " + civs[i].name);
                    break;
                
                case 'default':
                    break;
            }
        }

        console.log("DLC: " + dlcCivs);
        console.log("GS" + gsCivs);


        $('#numPlayersBtn').click(function() {
            $('#numberOptions').hide();
            $('#settingsGrid').show();
            $('#randomsGrid').hide();
            $('#randomizeContainer').show();

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
            
            $('#players').html('<h5 class="col-12 mt-2">Enter player names (Optional): </h5>' +
                                '<form action="/">'
                            );

            for (var i = 0; i < numPlayers; i++) {
                $('#players').append('<div class="col-12 col-lg-6 mt-3"><label class="pr-2" for="player' + parseInt(i+1) + '">Player ' + parseInt(i+1) + ': </label><input id="p'+i+'" type="text"></div>');
            }

            
            $('#allCivs').html('<h5 class="text-center">Civs Included:</h5>');
            for (var i = 0; i < numCivs; i++) {
                $('#allCivs').append(
                    '<div class="col-6 col-sm-4 col-md-6 col-lg-4 col-xl-3" style="display: inline-block;">' +
                        '<input type="checkbox" class="" id="' + civs[i].name + '" checked>' +
                        '<label class="pl-1" for="' + civs[i].name + '">' + civs[i].name + '</label>' +
                    '</div>'
                );
            }          
        });


        $('body').on('click', '#randomize', function() {
            $('#randomizeContainer').hide();
            $('#settingsGrid').hide();
            $('#randomsGrid').show();
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
                        var civName = civsUsed[roll];
                        randoms.push(civName);
                    }

                    allRandoms[i] = randoms;
                }

                //Reset randomsgrid
                $('#randomsGrid').html('');
                for(var i = 0; i < numPlayers; i++) {

                    $('#randomsGrid').append(
                        '<div class="col-12 col-sm-6 col-md-3 text-info my-2">' +
                            '<h4 class="ml-2" id="p' + i + 'name"></h4>' +
                            '<div class="list-group" id="p' + i + 'randoms"></div>'+
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

                        var civObject = allRandoms[i][random].leaders[0];
                        $('#p' + i + 'randoms').append(
                            '<button class="list-group-item list-group-item-action" style="color:' + civObject.fColor + '; background: ' + civObject.bColor + ';" type="button" data-toggle="modal" data-target="#modal" id="' + allRandoms[i][random].name + 'btn" value="'+allRandoms[i][random].id+'">'+
                                allRandoms[i][random].name +
                            '</button>'
                        );

                        $('body').on('click', '#' + allRandoms[i][random].name + 'btn', function() {                          
                            
                            var civObject = civs[this.value];
                            
                            $('#civCardTitle').html(civObject.name);

                            $('#civCardImageContainer').html(
                                '<img id="civCardImage" src="' + civObject.leaders[0].img + '">'    
                            );

                            $('#civCard').css({
                                "color": civObject.leaders[0].fColor, 
                                "background": civObject.leaders[0].bColor
                            });

                            $('.close').css("color", civObject.leaders[0].fColor);

                            $('#civCardBody').html(
                                '<div class="row">' +
                                    '<div class="col-12 my-2"><h5>Civ Ability - ' + civObject.abilityName + '</h5>' +
                                    '<p>' + civObject.ability + '</p></div>' +
                                '</div>' +

                                '<div class="row border-top">' +
                                    '<div class="col-6 my-2 d-flex align-items-center h100 pr-2">' +
                                        '<div>' +                               
                                            (civObject.leaders.length > 1 ? '<h5>Leader: </h5><select onchange="leaderChange(' + this.value + ')" class="mb-1" id="leaderSelect"></select>': '<h5>Leader: ' + civObject.leaders[0].name + '</h5>') +
                                        '</div>' +
                                        
                                        '<img id="leaderPic" class="mx-auto" src="' + civObject.leaders[0].portrait + '" width="200px" height="200px">' +
                                    '</div>' +
                                    '<div class="col-6 my-2 d-flex align-items-center h100">' +
                                        '<div class="">' +     
                                            '<h5 id="abilityName">Leader Bonus - ' + civObject.leaders[0].abilityName + '</h5>' +
                                            '<p id="ability">' + civObject.leaders[0].ability + '</p>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +

                                '<div class="row border-top">' +
                                    '<div class="col-12 col-lg mt-5">' +
                                        '<h5>Unique Unit: ' + civObject.unit.name + '</h5>' +
                                        '<p>' + civObject.unit.desc + '</p>' + '<span><img src="' + civObject.unit.img + '" alt="Unit Img Not Available"></span>' +
                                        '<ul class="mt-2" id="unitAttr"></ul>' +
                                    '</div>' +
                                    '<div class="col-12 col-lg mt-5">' +
                                        '<h5>Unique Infrastructure: ' + civObject.infrastructure.name + '</h5>' +
                                        '<p>' + civObject.infrastructure.desc + '</p>' + '<span><img src="' + civObject.infrastructure.img + '" alt="Infrastructure Img Not Available"></span>' +
                                        '<ul class="mt-2" id="infraAttr"></ul>' +
                                    '</div>' +
                                '</div>'    
                            );

                            for (leader in civObject.leaders) {
                                $('#leaderSelect').append(
                                    '<option value="' + civObject.leaders[leader].id + '">' +
                                        civObject.leaders[leader].name +
                                    '</option>'
                                );
                            }

                            var unitAttributes = civObject.unit.attributes;
                            for (attribute in unitAttributes) {
                                $('#unitAttr').append(
                                    '<li>' + unitAttributes[attribute] + '</li>'
                                );
                            }

                            var infraAttributes = civObject.infrastructure.attributes;
                            for (attribute in infraAttributes) {
                                $('#infraAttr').append(
                                    '<li>' + infraAttributes[attribute] + '</li>'
                                );
                            }

                            $('#wikiLink').html(
                                '<small class="pr-5">All Civ information and images pulled from the Civilization Wiki. For more in-depth information <a target="_blank" href="http://civilization.wikia.com/wiki/' + civObject.name + '_(Civ6)">click here</a> to visit their site</small>'
                            );
                           
                        });
                    }   
                }

            } else {
                alert("Number of civs requested exceeded the number of civs selected. Please change the values and try again");
            }
        });        
    });
});


leaderChange = function(leader) {

    $('body').on('change', '#leaderSelect', function() {

        var leaders = civs[leader].leaders;

        $('#abilityName').html('Leader Bonus - ' + leaders[this.value].abilityName);
        $('#ability').html(leaders[this.value].ability);
        $('#leaderPic').attr('src', leaders[this.value].portrait);
        $('#civCardImage').attr('src', leaders[this.value].img);

        $('#civCard').css({
            "color": leaders[this.value].fColor, 
            "background": leaders[this.value].bColor
        });       
    })
}

dlcCount = 14;

versionSelect = function(version) {

    var civsSelected = [];
    
    switch(version) {

        case 'vanilla':
            civsSelected = vanillaCivs;
            break;
        
        case 'raf':
            civsSelected = rafCivs;
            break;

        case 'gs':
            civsSelected = gsCivs;
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
                dlcCount = 14;
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

        case 'magc':
            civsSelected = [dlcCivs[8], dlcCivs[9]];
            dlcToggle();
            break;
        
        case 'eth':
            civsSelected = [dlcCivs[10]];
            dlcToggle();
            break;
        
        case 'bag':
            civsSelected = [dlcCivs[11], dlcCivs[12]];
            dlcToggle();
            break;
        
        case 'bab':
            civsSelected = [dlcCivs[13]];
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

            if(dlcCount >= 14){
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