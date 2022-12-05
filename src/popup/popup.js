let linksList = [];

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
	chrome.tabs.sendMessage(tabs[0].id, { type: "getLinks" }, function (response) {
		var arrTest = Array.prototype.slice.call(response.response_from_content);
		if (Array.isArray(arrTest)){
			console.log('yes');
			linksList = response.response_from_content;
			console.log(linksList)
			updateLinksList(linksList);
			// sendResponse({ farewell: "goodbye" });
		}
		console.log('no');
	});
	return true;
});

//
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		console.log(sender.tab ?
			"from a content script:" + sender.tab.url :
			"from the extension");
		if (request.greeting === "hello") {
			sendResponse({ farewell: "goodbye" });
			return true;
		} else if (request.response_from_content.linksList === Array) {
			linksList = request.response_from_content.linksList;
			updateLinksList(linksList);
			sendResponse({ farewell: "goodbye" });
			return true;
		}

	}
);

function updateLinksList(arrLinks) {
	let linksListUl = document.getElementById('linksList');
	//let li = document.createElement('li');
	if (arrLinks == null || arrLinks.length == 0) {
		let li = document.createElement('li');
		li.innerHTML = 'Ссылки не найдены';
		linksListUl.appendChild(li)
	}
	arrLinks.forEach((link) => {
		let li = document.createElement('li');
		li.innerHTML = link;
		linksListUl.appendChild(li)
	})
}

