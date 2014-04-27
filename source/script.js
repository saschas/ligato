$(document).ready(function(){

	var cleanArray = function(myArray){
		var out = [];
		var myBigObject = myArray[0];

		for (var i in myBigObject) {
		    if (myBigObject.hasOwnProperty(i)) {
		        out.push(myBigObject[i]);
		    }
		}
		console.log('out:' + out);
		return out;
	}

	var checkCoinsCount = function($array,$selector){
		var toGo;
		array_elements = $array;
		array_elements.sort();
		var current = null;
		var cnt = 0;
		for (var i = 0; i < array_elements.length; i++) {
		    if (array_elements[i] != current) {
		        if (cnt > 0) {
		        	if(current == $selector){
		        		//How many moves you have
		        		toGo = cnt;
		        		return toGo;
		        	}
		        }
		        current = array_elements[i];
		        cnt = 1;
		    } else {
		        cnt++;
		    }
		}
		if (cnt > 0) {
				if(current == $selector){
		        	//How many moves you have
		        	toGo = cnt;
		        	return toGo;
		        }
		    //console.log(current + ' comes --> ' + cnt + ' times');
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
			coins: [{}]
		}
		$actions = {};
		$('#menu p').text($player.moves);
		$('.field').addClass('nope').removeClass('choice');

		console.clear();
		states($game);
	}//end of setup

	var coinElement = function($actions,$player){
		var element = document.createElement('div');
			element.setAttribute('class','coin ' + $player.id);
			element.player = $player.id;
			$('.row:nth-child('+$actions.row+') .field:nth-child('+$actions.field+')').append(element);
	}

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
				$player.coins[0][$actions.row-1] = $actions.field;
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
			coinElement($actions,$player);			
			}
	}

	var action = function(el){
			$actions.parent = el;
			$actions.row = parseFloat(el.parent().index()+1);
			$actions.field = parseFloat(el.index()+1);
			console.log('$actions.field: ' + $actions.field);
			if($game.whileGame == true){

			}
			return $actions;
		}

	var reset = function(){
		$('.coin').remove();
		$('.row').removeClass('used');
	}

	var choices = function($moves){
		//console.log($count);
		var possibleFieldPlus = $actions.field + $moves;
		var possibleFieldMinus = $actions.field - $moves;

		//console.log(possibleFieldPlus, possibleFieldMinus)
		if(possibleFieldPlus<=10){
			var $selectorPlus = $('.row:nth-child('+$actions.row+') .field:nth-child('+possibleFieldPlus+')')
			$selectorPlus.addClass('choice-up');
			//console.log('minus Choice: ' + possibleFieldPlus);
		}
		if(possibleFieldMinus>0){
			var $selectorMinus = $('.row:nth-child('+$actions.row+') .field:nth-child('+possibleFieldMinus+')')
			$selectorMinus.addClass('choice-down');
			//console.log('minus Choice: ' + possibleFieldMinus);
		}
		$('.field.choice-up').click(function(){
			$player.row[$actions.row] = possibleFieldPlus;
		});
		$('.field.choice-down').click(function(){
			$player.row[$actions.row] = possibleFieldMinus;
		});
	}

	var states = function($game){
		$('.field').click(function(){
			if($game.beforeGame == true && $game.whileGame == false ){
				console.log('beforeGame');
				coin(action($(this)),$player);
			}
			if($game.whileGame == true){
				var $checkforCoin = $(this).has('.coin').length;
				var $checkforPossibleCoin = $(this).is('.choice-up, .choice-down');
				console.log($checkforCoin);

				//mark possible Moves
				if($checkforCoin>0){
					console.log('whileGame');
					action($(this));
					console.log('$player.coins: '+$player.coins);
					$player.row = cleanArray($player.coins);
					var $movesToGo = checkCoinsCount($player.row,$actions.field);
					choices($movesToGo);
				}

				//click on Choice
				if($checkforPossibleCoin){
					var choice = $(this).index()+1;//$('.row:nth-child('+$actions.row+') .field:nth-child('+$player.row[$actions.row]+')')
					var removeCoinSelector = $player.row[$actions.row];
					$('.row:nth-child('+$actions.row+') .field:nth-child('+removeCoinSelector+')').remove('coin')
					$player.row[$actions.row] = choice;

					console.log($actions,$player);
					coinElement($actions,$player);

					//$('.row:nth-child('+$actions.row+') .field:nth-child('+removeCoinSelector+')');
					console.log('du bist dabei auf feld '+choice+' zu springen');
				}
				else{return false;}		
			}
			else{
				console.log('dount')
			}

		});
			
		
	}
	
	

	window.onload = setup;


});