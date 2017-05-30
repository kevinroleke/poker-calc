/*
* @Author: noor
* @Date:   2017-05-24 10:00:31
* @Last Modified by:   noor
* @Last Modified time: 2017-05-30 12:28:00
*/

var _					= require('underscore');
var handGenerator		= require('./lib/findType');
var nameAndPriority		= require('./lib/nameAndPriority');
var utilsLib			= require('./utils/lib');

var prepareHighHandForEachPlayer = function(params){
	params.handsArray = [];
	for(var pCards of params.playerCards){
		var tmpParams 	   = { set: []};
		tmpParams.set 	   = params.boardCards.concat(pCards.cards);
		tmpParams.playerId = pCards.playerId;
		handGenerator.prepareHighHand(tmpParams);
		params.handsArray.push(tmpParams);
	}
}

var groupCardsWithEqualRank = function(params){
	groupedCards = {};
	for(var playerHand of params.handsArray){
		if(groupedCards[playerHand.hand.handInfo.strength]){
			groupedCards[playerHand.hand.handInfo.strength].push(playerHand);
		}else{
			groupedCards[playerHand.hand.handInfo.strength] = [ playerHand ];
		}
	}
	params.groupedCards = groupedCards;
};

var getHighestCards = function(params){
	var groupedCards   = params.groupedCards;
	var keys 		   = [];
	for(var k in groupedCards){
		keys.push(parseInt(k));
	}
	var key 		   = _.max(keys);
	params.highestCards = groupedCards[key]
	params.maxStrength  = key; 
};

var findHighestHand = function(params, arr, idx){
  var tester = -Infinity;
  var status = false;
  var tmpArr = [];
  for(var i = 0; i<arr.length; i++){
  	var checker = arr[i].hand.cards[idx].priority;
    if( checker > tester){
        tmpArr = [];
        tester = arr[i].hand.cards[idx].priority;
        tmpArr.push(arr[i]);

      }else if(checker == tester)
        tmpArr.push(arr[i]);
  }
  idx = idx+1;
  if(idx == 5 || tmpArr.length == 1){
    params.winner = tmpArr;
    return;
  }else
  	findHighestHand(params, tmpArr, idx);
}	

var decideWinner = function(params, flags){
	if(params.boardCards.length < 5 || params.playerCards.length < 1){
		return [];
	}
	prepareHighHandForEachPlayer(params);
	groupCardsWithEqualRank(params);
	getHighestCards(params);
	findHighestHand(params, params.highestCards, 0);
	if(flags.compactCards){
		return utilsLib.compactCards(params.winner);
	}
	return params.winner;
}

module.exports = { getHoldemWinner:decideWinner };