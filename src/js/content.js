// 1. По правой клавише мыши показывать контекстное меню с возможностью переключиться
//    на новую вкладку для авторизации под пользователем, который под курсором (проверка элемента на наличие ссылки на страницу пользователя)
// 2. По контекстному меню в инпуте показывать список для ввода (например заготовки для xss)


let centerX = document.documentElement.clientWidth / 2;
let centerY = document.documentElement.clientHeight / 2;
let elem = document.elementFromPoint(centerX, centerY);
let linksList = [];
let bodyEl = document.body;

chrome.runtime.sendMessage({ greeting: "hello" }, function (response) {
	console.table(response);
});

chrome.runtime.onMessage.addListener(
	function (message, sender, sendResponse) {
		if (message.type == 'getLinks') {
			linksList = getLinks();

			sendResponse({ response_from_content: linksList });
			return true;
		}
		sendResponse({ response_from_content: [] });
		return true;
	}
);

function createMessageUnder(elem, html) {
	// создаём элемент, который будет содержать сообщение
	let message = document.createElement('div');
	// для стилей лучше было бы использовать css-класс здесь
	message.style.cssText = "position:fixed; color: red; margin-top: 5px; padding: 5px; background-color: yellow; border: 1px solid blue; border-radius: 5px;";

	// устанавливаем координаты элементу, не забываем про "px"!
	let coords = elem.getBoundingClientRect();

	message.style.left = coords.left + "px";
	message.style.top = coords.bottom + "px";

	message.innerHTML = html;

	return message;
}

// Использование:
// добавим сообщение на страницу на 5 секунд
let message = createMessageUnder(elem, 'Hello, world!');
document.body.append(message);
setTimeout(() => message.remove(), 3000);

function getLinks() {
	var aList = document.getElementsByTagName('a');
	aList = Array.from(aList);
	return aList.map(i => { return i.href });
}

/* Координаты курсора */
document.addEventListener("click", (e) => {
	console.log(e.button)
	if (e.button == 2) {
		var coord = getPosition(e);
		let elem = document.elementFromPoint(coord.x, coord.y);
		let message = createMessageUnder(elem, 'X=' + coord.x + ' Y=' + coord.y);
		document.body.append(message);
		setTimeout(() => message.remove(), 800);
	}
});

function getPosition(e) {
	var x = y = 0;
	if (!e) {
		var e = window.event;
	}
	if (e.pageX || e.pageY) {
		x = e.pageX;
		y = e.pageY;
	} else if (e.clientX || e.clientY) {
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	return { x: x, y: y }
}

/* событие возникает при наведении курсора мыши на элемент HTML
*  target ссылка на элемент над которым находится курсор
*  relatedTarget ссылка на элемент с которого ушел курсор
*  mouseenter нельзя повесить на document, только на элемент
*/
document.addEventListener("mouseover", showInfo);

function showInfo(event) {

	// Поиск среди списка согласующих по ДИ
	// let el = document.querySelectorAll('.user-pick-block[onclick*="/user/"]')
	// el.forEach(u => { console.log(u.innerText) })

	let el = event.target;
	console.log(el.tagName);
	if (el.tagName == 'H1') {
		console.log('Bingo!');
		let message = createMessageUnder(el, 'Bingo!');
		document.body.append(message);
		setTimeout(() => message.remove(), 3000);
	}
	let prop = "target= " + event.target.tagName;
	if (event.relatedTarget != null) {
		prop += ", relatedTarget = " + event.relatedTarget.tagName;
	}

	let name = event.currentTarget.tagName;
	console.log(name + " mouseover: " + prop);

}

chrome.runtime.onMessage.addListener((obj, sender, response) => {
	const { type, value, videoId } = obj;

	if (type === "NEW") {
		currentVideo = videoId;
		newVideoLoaded();
	} else if (type === "PLAY") {
		youtubePlayer.currentTime = value;
	} else if (type === "DELETE") {
		currentVideoBookmarks = currentVideoBookmarks.filter((b) => b.time != value);
		chrome.storage.sync.set({ [currentVideo]: JSON.stringify(currentVideoBookmarks) });

		response(currentVideoBookmarks);
	}
});

