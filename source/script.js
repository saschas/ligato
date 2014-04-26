$(document).ready(function(){
	$('#reset').click(function(){
		setup();
	});

	var $actions,$player;

	function setup(){
		reset();

		$player = {
			id:'one',
			maxCoins: 6,
			direction:'up',
			moves:20,
			currentCoins:0,
			row:[]
		}
		$actions = {};
		$('#menu p').text($player.moves);
		console.clear();
	}//end of setup

	var coin = function($action,$player){
			$condition = true;
			if($player.currentCoins === $player.maxCoins){
				$condition = false;
				console.log('You have reached the $maxCoins');
			}

			if($.inArray($actions.row , $player.row) != -1){//if in Array
				$condition = false;
				console.log('One Coin in the row');
			}

			if($condition === true){
				$player.currentCoins++;	
				$player.row.push($actions.row);
				$player.moves -= $actions.field;//noch x schritte
				$('#menu p').text($player.moves + ' / 20');

				// 60 Felder
				// 6 Steine
				// 20 Schritte 
				var $selector = '#row-' + $actions.row;
					$($selector).addClass('used');

					$currLeft =	60 - $player.currentCoins * 10;

					$waht = $currLeft / $player.currentCoins;


				console.log($waht,$player.row.length, $currLeft);



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
			console.log($actions.field)
			return $actions;
		}
	var reset = function(){
		$('.coin').remove();
		$('.row').removeClass('used');
	}


	$('.field').click(function(){
		coin(action($(this)),$player);
	})

	window.onload = setup;


});