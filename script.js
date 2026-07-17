const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  toast.classList.add('toast-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('toast-visible');
    setTimeout(() => (toast.hidden = true), 200);
  }, 2500);
}

// ============ SEARCH ============
const searchBar = document.getElementById('search-bar');
const projectCards = document.getElementById('project-cards');

searchBar.addEventListener('input', () => {
  const query = searchBar.value.trim().toLowerCase();
  const cards = projectCards.querySelectorAll('.card');

  cards.forEach((card) => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const desc = card.querySelector('p').textContent.toLowerCase();
    const matches = title.includes(query) || desc.includes(query);
    card.style.display = matches ? '' : 'none';
  });
});

// ============ NEW PROJECT MODAL ============
const modalOverlay = document.getElementById('modal-overlay');
const newProjectForm = document.getElementById('new-project-form');
const newBtn = document.getElementById('new-btn');
const modalCancel = document.getElementById('modal-cancel');
const titleInput = document.getElementById('new-project-title');
const descInput = document.getElementById('new-project-desc');

function openModal() {
  modalOverlay.hidden = false;
  titleInput.focus();
}

function closeModal() {
  modalOverlay.hidden = true;
  newProjectForm.reset();
}

newBtn.addEventListener('click', openModal);
modalCancel.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modalOverlay.hidden) closeModal();
});

newProjectForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const desc = descInput.value.trim() || 'No description yet.';
  if (!title) return;

  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <h3></h3>
    <p></p>
    <div class="card-actions">
      <span class="material-icons">grade</span>
      <span class="material-icons">visibility</span>
      <span class="material-icons">share</span>
    </div>
  `;
  card.querySelector('h3').textContent = title;
  card.querySelector('p').textContent = desc;

  projectCards.prepend(card);
  closeModal();
  showToast(`"${title}" created`);
});

// ============ UPLOAD ============
const uploadBtn = document.getElementById('upload-btn');
const uploadInput = document.getElementById('upload-input');

uploadBtn.addEventListener('click', () => uploadInput.click());

uploadInput.addEventListener('change', () => {
  const count = uploadInput.files.length;
  if (count === 0) return;
  const label = count === 1 ? uploadInput.files[0].name : `${count} files`;
  showToast(`Uploaded ${label}`);
  uploadInput.value = '';
});

// ============ SHARE ============
const shareBtn = document.getElementById('share-btn');

shareBtn.addEventListener('click', async () => {
  const shareData = {
    title: 'Morgan Oakley — Dashboard',
    text: 'Check out my dashboard!',
    url: window.location.href,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
    }
    return;
  }

  try {
    await navigator.clipboard.writeText(shareData.url);
    showToast('Link copied to clipboard');
  } catch (err) {
    showToast('Unable to copy link');
  }
});

// ============ CARD ACTION ICONS (favorite / view / share per card) ============
projectCards.addEventListener('click', (e) => {
  const icon = e.target.closest('.card-actions .material-icons');
  if (!icon) return;

  const title = icon.closest('.card').querySelector('h3').textContent;

  if (icon.textContent === 'grade') {
    icon.classList.toggle('favorited');
    showToast(
      icon.classList.contains('favorited')
        ? `Added "${title}" to favorites`
        : `Removed "${title}" from favorites`
    );
  } else if (icon.textContent === 'visibility') {
    showToast(`Opening "${title}"`);
  } else if (icon.textContent === 'share') {
    showToast(`Share link for "${title}" copied`);
  }
});