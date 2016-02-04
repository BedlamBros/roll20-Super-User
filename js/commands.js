//charName appears in journals and mocked chat while colloqName appears in player-sent chat
//sometimes colloq!=charName
var mockCharList = [
	{
		colloqName: "Cedric F.",
		charName: "Cedric",
		genderPronoun: "his"
	},
	{
		colloqName: "Ian B.",
		charName: "Furio",
		genderPronoun: "his"
	},
	{
		colloqName: "Wenwrick",
		charName: "Wenwrick",
		genderPronoun: "his"
	},
	{
		colloqName: "Keira M.",
		charName: "Keira",
		genderPronoun: "her"		
	},
	{
		colloqName: "Karanthos",
		charName: "Karanthos",
		genderPronoun: "his"
	}
];

function readCharList() {
	chrome.storage.sync.get({
		charList: []
	}, function(items){
		if (items.charList.length > 0){
			//check for any available whispers
			for (var i = 0; i < items.charList.length; i++) {
				if (charList[i].whispers.length > 0) {
					console.log("whisper found for " + charList[i].charName);
				}
			}
		}
	});
}

$(document).ready(function() {
	var chat = $('.textchatcontainer')[0];
	chat = $(chat).children()[1]; //this should be one line
	$(chat).bind('DOMNodeInserted', function(e) { 
		for (var i = 0; i < e.target.classList.length; i++) {
			if (e.target.classList[i] === "message") {
				if (timestampIsValid($(e.target))) {
					console.log("message is recent");
				}
				var cleansedMsg = cleanseMessageText($(e.target).text());
				var msgSender = parseCharNameFromRawMsg(cleansedMsg);
				console.log(cleansedMsg);
				parseMsg(cleansedMsg, msgSender);
				return; //stop the loop after message is found
			}
		}
	});
});

function cleanseMessageText(msg) {
	var reg = /:/;
	return msg.substring(msg.indexOf(reg), msg.length);
}

//accepts a raw message text and return sender's name
//relies on the assumption that the first colon, space sequence occurs after name
function parseCharNameFromRawMsg(msg) {
	var start = /AM|PM/;
	var end = /: /;
	return msg.substring(msg.search(start) + 2, msg.search(end));
}

function sendMessage(msg) {
	//find the send button before we need it
	//console.log("msg: " + msg);
	var buttons = $('button');
	for (var i = 0; i < buttons.length; i++) {
		if ($(buttons[i]).text().indexOf("Send") > 0) {
			sendButton = buttons[i];
		}
	}
	var chat_text = $('textarea')[0];
	//steal focus from user
	chat_text.focused = true;
	$(chat_text).val(msg);
	$(sendButton).click();
}

function sendWhisper(msg, char) {
	var buttons = $('button');
	for (var i = 0; i < buttons.length; i++) {
		if ($(buttons[i]).text().indexOf("Send") > 0) {
			sendButton = buttons[i];
		}
	}
	var chat_text = $('textarea')[0];
	//steal focus from user
	chat_text.focused = true;
	$(chat_text).val("/w " + char + " " + msg);
	$(sendButton).click();
}

function critFailModController(mod) {
	//TODO modify the success or failure based on given mod
}

/* controllerResults = a json that contains chance for results and a toString function that returns the chat text for results
 * name = the name of the character the result affects
 * flags = an array of optional flags that the controller may handle differently */
function randResultFromController(controllerResults, name, flags) {
	var rand = Math.random();
	var carry = controllerResults[0].chance;
		for (var i = 0; i < controllerResults.length; i++) {
		if (rand < carry){
			sendMessage(name + controllerResults[i].toString());
			return;
		} else {
			carry += controllerResults[i + 1].chance;
		}
	}
}

// raw = message div
// returns boolean
function timestampIsValid(div) {
	var now = new Date();
	var nowString = (now.getHours() % 12) + ":" + now.getMinutes();
	nowString += (now.getHours() > 12) ? "AM" : "PM";
	var children = $(div).children(); //avoids making assumptions about the index of the timestamp span
	for (var i = 0; i < children.length; i++) {
		if (children[i].classList[0] === "tstamp") {
			return $(children[i].classList[0]).text() === nowString;
		}
	}
}

function diceRoll(sides, mod) {
	var rand = Math.random();
	var res = (sides * rand) + 1 + mod;
	return Math.round(res);
}

//models used by controllers directly
var critFailResults = [
	{
		chance: 0.05,
		toString: function() {
			return " is pushed back";
		}
	},
	{
		chance: 0.30,
		toString: function() {
			return " is knocked prone";
		}
	},
	{
		chance: 0.45,
		toString: function() {
			return " injures themself taking " + diceRoll(4, 2) + " points of damage";
		}
	},
	{
		chance: 0.20,
		toString: function() {
			return " is unharmed but thoroughly embarassed";
		}
	}
];

var reactionResults = [
	{
		chance: 0.05,
		toString: function() {
			return " reacts violently";
		}
	},
	{
		chance: 0.40,
		toString: function() {
			return " reacts neutrally";
		}
	},
	{
		chance: 0.55,
		toString: function() {
			return " reacts cordially";
		}
	}
];

/*
** Models
------------------
*/var commands = [
	{
		name: "Crit Fail",
		cmd: "fail",
		flags: [
			{
				cmd: "mod",
				controller: critFailModController
			}
		],
		results: critFailResults
	},
	{
		name: "Reaction",
		cmd: "reaction",
		results: reactionResults
	}
];

function parseMsg(msg, name) {
	for (var i = 0; i < commands.length; i++) {
		if (msg.indexOf(commands[i].cmd) > -1) {
			randResultFromController(commands[i].results, name);
			return;
		}
	}
}

/*
** Chrome commands
------------------
*/
chrome.commands.onCommand.addListenener(function(command) {
	console.log(command);
	if (command === "start-character-crawl") {
		console.log("crawling char data");
		alert("please do not touch the keyboard or mouse while character data is being collected");
	}
});