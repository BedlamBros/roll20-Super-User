var CHAR_LIMIT = 10;
var INPUTS_ON_SCREEN = 5;

function saveNewCharacter() {
	var charList = [];
	var character = {};
	var charName = document.getElementById('charName').value;
	var colloqName = document.getElementById('colloqName').value;
	var genderPronoun = document.getElementById('genderPronoun').value;
	if (charName == '' || colloqName == '' || genderPronoun == ''){
		alert('No fields may be empty');
		return;
	}
	character.charName = charName;
	character.colloqName = colloqName;
	character.genderPronoun = genderPronoun;
	charList[charList.length] = character;

	chrome.storage.sync.set({
		charList: charList
	  }, function() {
	  	document.getElementById('saveButton').visibility = 'none';
	  	location.reload();
	  }
	);
}

function addNewCharacter() {
	chrome.storage.sync.get({
			charList: []
		}, function(items) {
		var charList = [];
		var character = {};
		var charName = document.getElementById('charName').value;
		var colloqName = document.getElementById('colloqName').value;
		var genderPronoun = document.getElementById('genderPronoun').value;
		if (charName == '' || colloqName == '' || genderPronoun == ''){
			alert('No fields may be empty');
			return;
		}
		var charList = items.charList;
		character.charName = charName;
		character.colloqName = colloqName;
		character.genderPronoun = genderPronoun;
		charList[charList.length] = character;

		chrome.storage.sync.set({
			charList: items.charList
		  }, function() {
		  	location.reload();
		  }
		);
	});
}

function restoreOptions() {
	chrome.storage.sync.get({
		charList: []
	}, function(items) {
		for (var i = 0; i < items.charList.length; i++) {
			console.log("recovered " + items.charList.length);
		}
		//if a charList is saved
		if (items.charList.length > 0) {
			document.getElementById('saveButton').addEventListener('click', addNewCharacter);
			//change the top h1
			if (items.charList.length == CHAR_LIMIT) {
				$("h1").innerHTML = "Character List Maxed At " + CHAR_LIMIT;
			} else {
				$("h1")[0].innerHTML = "Add Up To" 
					+ (CHAR_LIMIT - items.charList.length) 
					+ " Characters to the List";
				$("#saveButton").html("Add Characters");
				$()			
			}
			for (var i = 0; i < items.charList.length; i++) {
				var tr = $('<tr>');
				$(tr).css("cursor", "pointer");
				$(tr).on('click', function() {
					alert('enter a whisper for this character');
				});
				var td1 = $('<td>');
				td1.html(items.charList[i].charName);
				$(tr).append(td1);
				var td2 = $('<td>');
				td2.html(items.charList[i].colloqName);
				$(tr).append(td2);
				var td3 = $('<td>');
				td3.html(items.charList[i].genderPronoun);
				$(tr).append(td3);
				$("#header").after(tr);
			}
		} else {
			document.getElementById('saveButton').addEventListener('click', saveNewCharacter);
		}
	});
}

document.addEventListener('DOMContentLoaded', restoreOptions);