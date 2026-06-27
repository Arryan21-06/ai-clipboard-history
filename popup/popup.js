document.addEventListener('DOMContentLoaded', () => {
  const clipsList = document.getElementById('clipsList');
  const searchInput = document.getElementById('searchInput');
  const clearAllBtn = document.getElementById('clearAllBtn');
  let allClips = [];

  function loadClips() {
    chrome.storage.local.get(['clips'], (result) => {
      allClips = result.clips || [];
      renderClips(allClips);
    });
  }

  function renderClips(clipsToRender) {
    clipsList.innerHTML = '';

    // Sort so pinned items are first
    const sortedClips = [...clipsToRender].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.timestamp - a.timestamp;
    });

    sortedClips.forEach(clip => {
      const item = document.createElement('div');
      item.className = `clip-item ${clip.pinned ? 'pinned' : ''}`;

      const content = document.createElement('div');
      content.className = 'clip-content';
      // Truncate text for display if it's too long
      const displayText = clip.text.length > 200 ? clip.text.substring(0, 200) + '...' : clip.text;
      content.textContent = displayText;

      const meta = document.createElement('div');
      meta.className = 'clip-meta';

      const time = document.createElement('span');
      time.textContent = new Date(clip.timestamp).toLocaleString();

      const actions = document.createElement('div');
      actions.className = 'clip-actions';

      const copyBtn = document.createElement('button');
      copyBtn.textContent = 'Copy';
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(clip.text);
      };

      const pinBtn = document.createElement('button');
      pinBtn.textContent = 'Pin';
      pinBtn.className = `pin-btn ${clip.pinned ? 'active' : ''}`;
      pinBtn.onclick = () => {
        togglePin(clip.id);
      };

      const delBtn = document.createElement('button');
      delBtn.textContent = 'Del';
      delBtn.onclick = () => {
        deleteClip(clip.id);
      };

      actions.appendChild(copyBtn);
      actions.appendChild(pinBtn);
      actions.appendChild(delBtn);

      meta.appendChild(time);
      meta.appendChild(actions);

      item.appendChild(content);
      item.appendChild(meta);

      clipsList.appendChild(item);
    });
  }

  function togglePin(id) {
    const clipIndex = allClips.findIndex(c => c.id === id);
    if (clipIndex !== -1) {
      allClips[clipIndex].pinned = !allClips[clipIndex].pinned;
      saveClips(allClips);
    }
  }

  function deleteClip(id) {
    allClips = allClips.filter(c => c.id !== id);
    saveClips(allClips);
  }

  function saveClips(clips) {
    chrome.storage.local.set({ clips: clips }, () => {
      // Re-render based on current search filter if any
      const searchTerm = searchInput.value.toLowerCase();
      if (searchTerm) {
        renderClips(allClips.filter(c => c.text.toLowerCase().includes(searchTerm)));
      } else {
        renderClips(allClips);
      }
    });
  }

  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredClips = allClips.filter(clip =>
      clip.text.toLowerCase().includes(searchTerm)
    );
    renderClips(filteredClips);
  });

  clearAllBtn.addEventListener('click', () => {
    // Only delete unpinned items when clearing all
    allClips = allClips.filter(c => c.pinned);
    saveClips(allClips);
  });

  loadClips();
});