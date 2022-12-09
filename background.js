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
// chrome.contextMenus.create({
// 	id: 'searchForWord',
// 	title: 'Search on WIKI for: %s',
// 	contexts: ['selection'],
// })

chrome.runtime.onInstalled.addListener(async () => {
  for (let [tld, locale] of Object.entries(tldLocales)) {
    chrome.contextMenus.create({
      id: tld,
      title: locale,
      type: 'normal',
      contexts: ['selection'],
    });
  }
});

const tldLocales = {
  'com.au': 'Australia',
  'com.br': 'Brazil',
  'ca': 'Canada',
  'cn': 'China',
  'fr': 'France',
  'it': 'Italy',
  'co.in': 'India',
  'co.jp': 'Japan',
  'com.ms': 'Mexico',
  'ru': 'Russia',
  'co.za': 'South Africa',
  'co.uk': 'United Kingdom'
};

//listener for context menu
chrome.contextMenus.onClicked.addListener(function(info, tab){
	//the URL that will be added to based on the selection
	baseURL = "http://en.wikipedia.org/wiki/";
	var newURL = baseURL + info.selectionText.trim();
	//create the new URL in the user's browser
	chrome.tabs.create({ url: newURL });
})

chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab.url && tab.url.includes("youtube.com/watch")) {
    const queryParameters = tab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      videoId: urlParameters.get("v"),
    });
  }
});

///*** */

chrome.runtime.onInstalled.addListener(() => {
	console.log("hello")

	//receiving a message
	chrome.runtime.onMessage.addListener(
			function(request, sender, sendResponse) {
			console.log(sender.tab ?
									"from a content script:" + sender.tab.url :
									"from the extension");
			if (request.greeting === "hello")
					sendResponse({farewell: "goodbye"});
			}
	);

	//create context menu
	chrome.contextMenus.create({
			id: "wikipedia",
			title: "Search for: \"%s\" on Wikipedia",
			contexts: ["selection"],
	})
});

//listener for context menu
chrome.contextMenus.onClicked.addListener(function(info, tab){
	//the URL that will be added to based on the selection
	baseURL = "http://en.wikipedia.org/wiki/";
	var newURL = baseURL + info.selectionText;
	//create the new URL in the user's browser
	chrome.tabs.create({ url: newURL });
})
///*** */

