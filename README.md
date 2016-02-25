#About
Roll20 Super User is a chrome extension that uses the command pattern design to integrate new commands for Roll20.

#Install
In chrome, settings -> extensions, check dev mode, load unpacked extension, select this directory. Filtering out console.log'ing from Roll20 is highly recommend for working on this. Note that this extension is designed to be run on the DM/GM's browser. Playing characters interact with the extension through the game's chat.

#Modules
Modules are individual scripts that interact with the chat window in roll20. Modules contain individual features that can be turned on and off from the options page. All commands that interact with individual modules should begin with '#';
##4e Language Obfuscation
Language Obfuscation makes text unreadable in the chat window if the player does not know the language it was 'spoken' in. Languages for users are configured from the Options > Languages page. Posting a message that your character speaks uses the following format: #[language] message. (Ex: #dwarven I suspect this elf may not be trustworthy).

#TODO
- Warn users if the extension becomes broken because of a change in roll 20
- Customize command behavior from the options page