var elvenLang = {
	charSet: "ओॠऒॐऋऄख़३",
	spaceFrequency: 0.20,
	spaceChar: "\ ",
	terseness: 0.80,
	commands: ["elven", "elvish", "elf", "elvin"]
};

var dwarvenLang = {
	charSet: "ሑቄቕሗሧቹሙለሯኞኯሿኅኲኴፅዺዅዂዐ፬ቊ",
	spaceFrequency: 0.10,
	spaceChar: "\n",
	terseness: 1.25,
	commands: ["dwarven", "dwarf", "dwarvin", "dwarve"]
};

var deepSpeechLang = {
	charSet: "ᚡᚱᛑᛰᚸᛦᛤᛥᛝᚬᚯᚿᛟᛯᛔᛯᚥᛰᛢ",
	spaceFrequency: 0.10,
	spaceChar: "ᚲ",
	terseness: 1.10,
	commands: ["deepSpeech", "deep", "deepspeech", "deep speech"]
}

var goblinLang = {
	charSet: "ぐこぃいつぴづしゖょじべぺにるれろゝのゞく",
	spaceFrequency: 0.3,
	spaceChar: "\ ",
	terseness: 2,
	commands: ["goblin", "goblish", "goblinLang"]
}

var abyssalLang = {
	charSet: "▒▓█",
	spaceFrequency: 0,
	spaceChar: "",
	terseness: 1.50,
	commands: ["abyssal", "abyss"]
}

var giantLang = {
	charSet: 'ϑϒζΨΘΫͻͽνϫϗϪϼϽώϯϐϠϰ',
	spaceFrequency: 0,
	spaceChar: "",
	terseness: 0.2,
	commands: ["giant", "ogre", "giantish"]
}

var draconicLang = {
	charSet: 'ᎠᏇᏨᎺᎰᏠᏡᏰᏱᏲᏲᏫᏎᎿᎭᎨᎸ',
	spaceFrequency: 0.85,
	spaceChar: "\ ",
	terseness: 2,
	commands: ["draconic", "dragon", "dragonborn", "dragonlang", "draconiclang"]
}

var langList = [elvenLang, dwarvenLang, abyssalLang, giantLang, goblinLang, draconicLang, deepSpeechLang, goblinLang];

var saveThese = "፠᛭";

function stringToDiffLang(t, lang) {
	var len = Math.round(t.length * lang.terseness);
	var output = "";
	for (var i = 0; i < len; i++) {
		if (Math.random() < lang.spaceFrequency) {
			output += lang.spaceChar;
		} else {
			var index = Math.round(Math.random() * (lang.charSet.length - 1));
			output += lang.charSet[index];
		}
	}
	return output;
}
var MSG_THROTTLE_DELAY = 30 * 1000; //30s for the chat to load old messages we want to filter
var page_load = new Date();
var MSG_THROTTLE = 2000;
var msg_last_sent = 0;
var lastChatCommand = "";
$(document).ready(function() {
	var chat = $('.textchatcontainer')[0];
	chat = $(chat).children()[1]; //this should be one line
	$(chat).bind('DOMNodeInserted', function(e) { //every time a node is inserted into chat
		for (var i = 0; i < e.target.classList.length; i++) {
			var d = new Date();
			if (e.target.classList[i] === "message" && $(e.target).text() != lastChatCommand && d.getTime() - msg_last_sent >= MSG_THROTTLE) { //if the div is a message
				//console.log('last chat command of ' + lastChatCommand + ' != ' + $(e.target).text());
				//console.log(d.getTime() + ' is more recent than ' + msg_last_sent);
				var page_is_loading = page_load.getTime() - d.getTime() > MSG_THROTTLE_DELAY;
				if (page_is_loading) {
					console.log('page is still loading');
				}
				lastChatCommand = $(e.target).text();
				msg_last_sent = d.getTime();
				var cleansedMsg = cleanseMessageText($(e.target).text());
				//console.log(cleansedMsg);
				setMsgVisibility(e.target, cleansedMsg, page_is_loading);
				break; //stop the loop after message is found
			}
		}
	});
});

function setMsgVisibility(node, msg, is_loading) {
	if (char_languages) {
		for (var i = 0; i < langList.length; i++) {
			for (var i2 = 0; i2 < langList[i].commands.length; i2++) {
				if (msg.indexOf("#" + langList[i].commands[i2]) > -1) {
					if (!characterSpeaksLanguage(langList[i].commands[0])) {
						console.log(char_languages.charName + ' does not speak ' + langList[i].commands[0]);
						$(node).css({'display': 'none'});
					} else {
						if (!is_loading) {
							parseMsg(msg);
						}
					}
				}
			}
		}
	} else {
		console.log("char_languages not yet set");
	}
}

//returns boolean
function characterSpeaksLanguage(lang) {
	switch (lang){
		case "dwarven":
			return char_languages.knowsDwarven;
		case "elven":
			return char_languages.knowsElven;
		case "abyssal":
			return char_languages.knowsAbyssal;
		case "deepSpeech":
			return char_languages.knowsDeepSpeech;
		case "giant":
			return char_languages.knowsGiant;
		case "draconic":
			return char_languages.knowsDraconic;
		case "goblin":
			return char_languages.knowsGoblin;
		default:
			return false;
	}
}

function parseMsg(msg, name) {
	for (var i = 0; i < langList.length; i++) {
		for (var i_lang = 0;i_lang < langList[i].commands.length; i_lang++){
			if (msg.indexOf("#" + langList[i].commands[i_lang]) > -1) {
				console.log('parsing: ' + msg);
				sendMessage(stringToDiffLang(msg, langList[i]))
				return;
			}
		}
	}
}

function cleanseMessageText(msg) {
	var reg = /:/;
	return msg.substring(msg.indexOf(reg), msg.length);
}

//should remove elements as it goes
function scramble(msg) {
	var s = "";
	var msgLength = msg.length
	for (var i = 0; i < msgLength; i++) {
		var randIndex = Math.round(Math.random() * msg.length);
		console.log("index of" + randIndex);
		s += msg.substring(randIndex, randIndex + 1);
		msg = spliceSlice(msg, randIndex, 1);
	}
	return s;
}

// http://stackoverflow.com/questions/20817618/is-there-a-splice-method-for-strings
function spliceSlice(str, index, count, add) {
  return str.slice(0, index) + (add || "") + str.slice(index + count);
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

//this recovers any character options related to this controller 
//from sync storage. this should be bound do window load
var char_languages = {};
function recoverOptions(charLanguages) {
	char_languages = charLanguages;
}

$(document).ready(function() {
	console.log('requesting localstorage from background page');

});
chrome.runtime.sendMessage({method: "getLocalStorage"}, function(response) {
	console.log(response.data);
	recoverOptions(response.data);
});