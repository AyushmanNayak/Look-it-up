chrome.runtime.onInstalled.addListener(()=>{
    chrome.contextMenus.create({
        id : "lookupWord",
        title : "look it up",
        contexts : ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "lookupWord") {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: lookUpWord,
        args: [info.selectionText]
      });
    }
  });

  function lookUpWord(selectedText) {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${selectedText}`)
      .then(response => response.json())
      .then(data => {
        const meaning = data[0]?.meanings[0]?.definitions[0]?.definition || "No definition found";
        alert(`Meaning of "${selectedText}": ${meaning}`);
      })
      .catch(error => {
        console.error('Error fetching word meaning:', error);
        alert(`Could not fetch meaning for "${selectedText}"`);
      });
  }