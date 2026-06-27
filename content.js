document.addEventListener("copy", (e) => {
  const text = e.clipboardData ? e.clipboardData.getData("text/plain") : window.getSelection().toString();

  if (text && text.trim() !== "") {
    chrome.runtime.sendMessage({ type: "NEW_CLIP", text: text });
  }
});