$(document).ready(function(){

	var countDupli = function(myArray,$selector){
		var counts = [];
		for (i = 0; i < myArray.length; i++) {
			counts[i] = 0;
			for (j = 0; j < myArray.length; j++) {
				if (myArray[i] == myArray[j]) {
					counts[i]++;
				}
			}
		}
		if($selector != undefined){
			return counts[$selector];	
		}
	}


	$('#reset').click(function(){
		setup();
	});

	var $game,$actions,$player;

	function setup(){
		reset();
		$game = {
			beforeGame: true,
			whileGame : false,
			afterGame : false
		}
		$player = {
			id:'one',
			maxCoins: 6,
			direction:'up',
			moves:20,
			currentCoins:0,
			row:[],
			coins: []
		}
		$actions = {};
		$('#menu p').text($player.moves);
		$('.field').addClass('nope').removeClass('choice');

		console.clear();
		states($game);
	}//end of setup

	var coin = function($action,$player){
			$condition = true;
			if($game.whileGame == true){
				$condition = false;
			}
			if(!$actions.parent.hasClass('nope')){
				$condition = false;
			}
			if($player.currentCoins === $player.maxCoins){
				$condition = false;
				$game.beforeGame = false;
				$game.whileGame = true;
				states($game)
				//console.log('You have reached the $maxCoins');
			}

			if($.inArray($actions.row , $player.row) != -1 && $game.whileGame == false){//if in Array
				$condition = false;
				console.log('One Coin in the row');
			}

			if($condition === true){
				$player.currentCoins++;	
				$player.row.push($actions.row);
				$player.coins[$actions.row] = $actions.field;
				$player.moves -= $actions.field;//noch x schritte
				$('#menu p').text($player.moves + ' / 20');

				// 60 Felder
				// 6 Steine
				// 20 Schritte 
				var $selector = '#row-' + $actions.row;
					$($selector).addClass('used');

				var	$currLeft =	60 - $player.currentCoins * 10;

				var $fieldsLeft = 6 - ($player.currentCoins) - 1;
					
				var $stillToGo = $player.moves - $fieldsLeft;
				$('.nope').removeClass('nope');
				//Auswahl der noch klickbaren Elemente
				$('.row').each(function($index){
					var $selector = $index + 1;
					if($.inArray($selector , $player.row) != -1){}
					else{
						$('.row:nth-child('+$selector+') .field:lt('+$stillToGo+')').addClass('nope');
					}
				});

			//Creates Coin
			var element = document.createElement('div');
				element.setAttribute('class','coin ' + $player.id);
				element.player = $player.id;
				$actions.parent.append(element);
			}
	}

	var action = function(el){
			$actions.parent = el;
			$actions.row = parseFloat(el.parent().index()+1);
			$actions.field = parseFloat(el.index()+1);

			if($game.whileGame == true){

			}
			return $actions;
		}

	var reset = function(){
		$('.coin').remove();
		$('.row').removeClass('used');
	}

	var jump = function($count){
		console.log($count);
		var possibleFieldPlus = $actions.field + $count;
		var possibleFieldMinus = $actions.field - $count;

		console.log(possibleFieldPlus, possibleFieldMinus)
		if(possibleFieldPlus<=10){
			$('.row:nth-child('+$actions.row+') .field:nth-child('+possibleFieldPlus+')').addClass('choice');
			console.log('minus Choice: ' + possibleFieldPlus);
		}
		if(possibleFieldMinus>0){
			$('.row:nth-child('+$actions.row+') .field:nth-child('+possibleFieldMinus+')').addClass('choice');
			console.log('minus Choice: ' + possibleFieldMinus);
		}
		$('.field.choice').click(function(){

		});
	}

	var states = function($game){
		$('.field.nope').click(function(){
			if($game.beforeGame == true && $game.whileGame == false ){
				console.log('beforeGame');
				coin(action($(this)),$player);
			}
			if($game.whileGame == true){
				console.log('whileGame');
				action($(this));
				var $count = countDupli($player.coins,$actions.field);
				jump($count);
			}
			else{
				console.log('dount')
			}
		})
	}
	
	

	window.onload = setup;


});