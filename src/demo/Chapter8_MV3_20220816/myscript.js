document.getElementById("id_Recv").onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: RecvFromDomainA
    });
  });
}

document.getElementById("id_Send").onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: SendToDomainB
    });
  });
}

function RecvFromDomainA() {
  let value = document.getElementById("id_DomainA").value;
  chrome.runtime.sendMessage({ method: "send", key: "key", value: value }, () => {
  });
}

function SendToDomainB() {
  chrome.runtime.sendMessage({ method: "recv", key: "key" }, (response) => {
    document.getElementById("id_DomainB").value = response.value;
  });
}