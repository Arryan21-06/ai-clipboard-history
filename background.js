chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "NEW_CLIP") {
    chrome.storage.local.get(["clips"], (result) => {
      let clips = result.clips || [];
      const newClip = {
        id: Date.now(),
        text: message.text,
        timestamp: Date.now(),
        pinned: false,
        title: null
      };

      clips.unshift(newClip);

      if (clips.length > 100) {
        clips.pop();
      }

      chrome.storage.local.set({ clips: clips });
    });
  }
});