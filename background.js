chrome.runtime.onInstalled.addListener(() => {
	chrome.action.setBadgeText({
		text: "ON",
	});
});

const extensions = 'https://dzen.ru/*'
const webstore = 'https://developer.chrome.com/docs/webstore'
const youtube = 'https://www.youtube.com/'

chrome.action.onClicked.addListener(async (tab) => {
	if (tab.url.startsWith(extensions) || tab.url.startsWith(webstore) || tab.url.startsWith(youtube)) {
		// Retrieve the action badge to check if the extension is 'ON' or 'OFF'
		const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
		// Next state will always be the opposite
		const nextState = prevState === 'ON' ? 'OFF' : 'ON'

		// Set the action badge to the next state
		await chrome.action.setBadgeText({
			tabId: tab.id,
			text: nextState,
		});


		chrome.scripting.executeScript({
			target: { tabId: tab.id },
			files: ['src/js/content.js']
		});

		if (nextState === "ON") {
			// Insert the CSS file when the user turns the extension on
			await chrome.scripting.insertCSS({
				files: ["src/css/focus-mode.css"],
				target: { tabId: tab.id },
			});
		} else if (nextState === "OFF") {
			// Remove the CSS file when the user turns the extension off
			await chrome.scripting.removeCSS({
				files: ["src/css/focus-mode.css"],
				target: { tabId: tab.id },
			});
		}
	}
});

// create new menu
chrome.contextMenus.create({
	id: 'searchForWord',
	title: 'Search on WIKI for: %s',
	contexts: ['selection'],
})

//listener for context menu
chrome.contextMenus.onClicked.addListener(function(info, tab){
	//the URL that will be added to based on the selection
	baseURL = "http://en.wikipedia.org/wiki/";
	var newURL = baseURL + info.selectionText.trim();
	//create the new URL in the user's browser
	chrome.tabs.create({ url: newURL });
})

