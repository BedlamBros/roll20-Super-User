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

/*
chrome.tabs.create({
    url: chrome.extension.getURL('roll20whispers.html'),
    active: false
}, function(tab) {
    // After the tab has been created, open a window to inject the tab
    chrome.windows.create({
        tabId: tab.id,
        type: 'panel',
        focused: true,
        state: 'fullscreen'
    });
});
*/

$(document).ready(function() {
	var chat = $('.textchatcontainer')[0];
	chat = $(chat).children()[1];
	$(chat).bind('DOMNodeInserted', function(e) { 
		for (var i = 0; i < e.target.classList.length; i++) {
			if (e.target.classList[i] === "message") {
				var cleansedMsg = cleanseMessageText($(e.target).text());
				console.log(cleansedMsg);
				parseMsg(cleansedMsg);
				break; //stop the loop after message is found
			}
		}
	});
});

var CRIT_FAIL_CMD = "#fail";
function cleanseMessageText(msg) {
	var reg = /:/;
	return msg.substring(msg.indexOf(reg), msg.length);
}

function parseMsg(msg) {
	for (var i = 0; i < commands.length; i++) {
		if (msg.indexOf(commands[i].cmd) > -1) {
			commands[i].controller("Wenwrick");
		}
	}
}

function sendMessage(msg) {
	//find the send button before we need it
	console.log("msg: " + msg);
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

function critFailController(name) {
	console.log("crit fail detected");
	var rand = Math.random();
	var carry = critFailResults[0].chance;
	for (var i = 0; i < critFailResults.length; i++) {
		console.log("random num is " + rand);
		console.log("carry is " + carry);
		if (rand < carry){
			sendMessage(name + critFailResults[i].text);
			return;
		} else {
			carry += critFailResults[i + 1].chance;
		}
	}
}

function diceRoll(sides, mod) {
	var rand = Math.random();
	var res = (sides * rand) + 1 + mod;
	return res;
}

//Models
var commands = [
	{
		name: "Crit Fail",
		cmd: "fail",
		flags: [
			{
				cmd: "mod",
				controller: critFailModController
			}
		],
		controller: critFailController
	},
	{
		name: "Reaction",
		cmd: "reaction",
		controller: reactionController
	}
];

var critFailResults = [
	{
		chance: 0.05,
		text: " drops their weapon."
	}, 
	{
		chance: 0.30,
		text: " falls to the ground."
	},
	{
		chance: 0.45,
		text: " becomes blinded or deafened."
	}, 
	{
		chance: 0.30,
		text: " is unharmed but thoroughly embarassed."
	}
];

var reactionResults = [
	{
		chance: 0.05
		text: " reacts vio"
	},
	{

	}
];

var charMap = [
	{
		character: "Wenwrick",
		colloq: "Wenwrik"
	},
	{
		character: "Furio",
		colloq: "Ian"
	}
];