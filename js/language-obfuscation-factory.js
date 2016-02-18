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
	commands: ["dwarven", "dwarf", "dwarvin"]
};

var deepSpeechLang = {
	charSet: "ᚡᚱᛑᛰᚸᛦᛤᛥᛝᚬᚯᚿᛟᛯᛔᛯᚥᛰᛢ",
	spaceFrequency: 0.10,
	spaceChar: "ᚲ",
	terseness: 1.10,
	commands: ["deep", "deepspeech", "deep speech"]
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
	commands: ["giant", "ogre"]
}

var langList = [elvenLang, dwarvenLang, abyssalLang, giantLang];

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
				console.log('last chat command of ' + lastChatCommand + ' != ' + $(e.target).text());
				console.log(d.getTime() + ' is more recent than ' + msg_last_sent);
				lastChatCommand = $(e.target).text();
				msg_last_sent = d.getTime();
				var cleansedMsg = cleanseMessageText($(e.target).text());
				//console.log(cleansedMsg);
				parseMsg(cleansedMsg, "none");
				break;; //stop the loop after message is found
			}
		}
	});
});

function parseMsg(msg, name) {
	for (var i = 0; i < langList.length; i++) {
		if (msg.indexOf("#" + langList[i].commands[0]) > -1) {
			console.log('parsing: ' + msg);
			sendMessage(stringToDiffLang(msg, langList[i]))
			return;
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
function recoverOptions() {
	chrome.sync.storage.get({
		charLanguages: {}
	}, function(items) {
		if (items.charLanguages.charName.length > 0) {
			console.log('charLanguages for ' + items.charLanguages.charName + ' have been recovered');
			console.log('browserUnicodeCompliant = ' + charLanguages.browserIsUnicodeCompliant);
		}
	})
}