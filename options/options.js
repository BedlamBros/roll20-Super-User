var CHAR_LIMIT = 10;
var INPUTS_ON_SCREEN = 5;
var USER_IS_DM = false;

function saveNewCharacter() {
	var charList = [];
	var character = {};
	var charName = document.getElementById('charName').value;
	var colloqName = document.getElementById('colloqName').value;
	var genderPronoun = $($('select')[0]).find(':selected').text();
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
			if (items.charList.length > 9) { //limit of characters
				$('#saveButton').css('visibility', 'none');
			}
			if (USER_IS_DM) {
				document.getElementById('saveButton').addEventListener('click', addNewCharacter);				
			}
			//change the top h1
			if (items.charList.length == CHAR_LIMIT) {
				$("h1").innerHTML = "Character List Maxed At " + CHAR_LIMIT;
			} else {
				if (USER_IS_DM){
					$("h1")[0].innerHTML = "Add Up To " 
						+ (CHAR_LIMIT - items.charList.length) 
						+ " Characters to the List";					
				} else {
					$("h1")[0].innerHTML = "Click Your Character to Set Known Languages";
				}
				$("#saveButton").html("Add Characters");
			}
			for (var i = 0; i < items.charList.length; i++) {
				var tr = $('<tr>');
				$(tr).addClass('charRow');
				$(tr).css("cursor", "pointer");
				//add a click handler that opens the whisper dialog
				$(tr).on('click', function() {
					$('#dialogLang').dialog();
					var charClicked = $($(this).children()[0]).text();
					$($('.ui-dialog-title')[0]).text('Select All Languages Spoken By ' + charClicked);
				});
				var td1 = $('<td>');
				td1.html(items.charList[i].charName);
				td1.id = "charNameCell";
				$(tr).append(td1);
				var td2 = $('<td>');
				td2.html(items.charList[i].colloqName);
				$(tr).append(td2);
				var td3 = $('<td>');
				td3.html(items.charList[i].genderPronoun);
				$(tr).append(td3);
				$("#header").after(tr);
				//break if the user is not a dm
				if (!USER_IS_DM) {
					$('#saveButton').css('display', 'none');
					$('#inputRow').css('display', 'none');
					return;
				}
			}
		} else {
			document.getElementById('saveButton').addEventListener('click', saveNewCharacter);
		}
	});
	//for language options
	chrome.storage.sync.get({
		charLanguages: {}
	}, function(items) {
		console.log(items.charLanguages);
	});
}

function saveCharLanguagesObjectFromDOM() {
	var charLanguages = {};
	charLanguages.knowsAbyssal = $('#abyssalCheckbox').is(':checked');
	charLanguages.knowsDwarven = $('#dwarvenCheckbox').is(':checked');
	charLanguages.knowsElven = $('#elvenCheckbox').is(':checked');
	charLanguages.knowsDeepSpeech = $('#deepSpeechCheckbox').is(':checked');
	charLanguages.knowsGiant = $('#giantCheckbox').is(':checked');
	charLanguages.browserIsUnicodeCompliant = browserIsUnicodeCompliant();
	charLanguages.charName = $($($('.charRow')[0]).children()[0]).html();
	chrome.storage.sync.set({
		charLanguages: charLanguages
	}, function() {
		location.reload();
	});
}

function saveWhisperForCharacter(charName, whisper) {
	chrome.storage.sync.get({
			charList: []
		}, function(items) {
			var charList = items.charList;
			for (var i = 0; i < charList.length; i++) {
				if (charList[i].charName == charName) {
					if (charList[i].whispers) {
						charList[i].whispers[charList[i].whispers.length] = whisper;
					} else {
						charList[i].whispers = [];
						charList[i].whispers[0] = whisper;
					}
					break;
				}
			}
			//save after whisper has been added to charList
			chrome.storage.sync.set({
			charList: charList
		  }, function() {
		  	location.reload();
		  }
		);
		});	
}

//returns boolean if browser can support unicode
function browserIsUnicodeCompliant() {
	return document.getElementById('unicodeContainer').offsetWidth ===
        document.getElementById('unprintableContainer').offsetWidth;
}

$(document).ready(function() {
	//enable tooltips
	$('[data-toggle="tooltip"]').tooltip(); 
	//test browser support for utf-8
	if (browserIsUnicodeCompliant()) {
		$('#unicodeTestResult').css('color', 'GREEN');
		$('#unicodeTestResult').html('&#x2713; Your browser supports the fonts used in this extension');
	} else {
		$('#unicodeTestResult').css('color', 'RED');
		$('#unicodeTestResult').html('&#10007; Your browser does not support the fonts used in this extension. Try switching to chrome if you are on a different browser or upgrading to the latest version.');
	}
});

$('#dialogLangButtonSave').on('click', function() {
	saveCharLanguagesObjectFromDOM();
});

document.addEventListener('DOMContentLoaded', restoreOptions);