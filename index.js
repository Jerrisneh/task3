// Fixing issues and refactoring for clarity and proper functionality

const form = document.getElementById('elementForm');
const canvas = document.getElementById('canvas');
const toggleFormBtn = document.getElementById('toggleFormBtn');
const deleteElementBtn = document.getElementById('deleteElementBtn');
const cancelBtn = document.getElementById('cancelBtn');
const undoContainer = document.getElementById('undoContainer');
const undoMessage = document.getElementById('undoMessage');
const undoBtn = document.getElementById('undoBtn');

let elements = JSON.parse(localStorage.getItem('elements'));
if (!Array.isArray(elements)) {
  elements = [];
}

let currentEditIndex = null;
let deletedElement = null;
let deletedElementIndex = null;
let undoTimer = null;

function isOverlapping(r1, r2) {
  return !(r2.left > r1.right ||
           r2.right < r1.left ||
           r2.top > r1.bottom ||
           r2.bottom < r1.top);
}

function getAllEditIconRects() {
  return Array.from(document.querySelectorAll('.edit-icon')).map(icon => icon.getBoundingClientRect());
}

function showUndo(index, element) {
  deletedElement = element;
  deletedElementIndex = index;
  let seconds = 5;
  undoMessage.textContent = `Element deleted. Undo in ${seconds} seconds...`;
  undoContainer.style.display = 'block';
  clearInterval(undoTimer);
  undoTimer = setInterval(() => {
    seconds--;
    if (seconds <= 0) {
      clearInterval(undoTimer);
      undoContainer.style.display = 'none';
      deletedElement = null;
    } else {
      undoMessage.textContent = `Element deleted. Undo in ${seconds} seconds...`;
    }
  }, 1000);
}

function createElementFromData(data, index) {
  const el = document.createElement(data.type);
  el.textContent = data.text;
  el.setAttribute('data-index', index);

  el.style.width = data.width;
  el.style.height = data.height;
  el.style.color = data.color;
  el.style.backgroundColor = data.bgColor;
  if (data.display) el.style.display = data.display;
  if (data.alignment) el.style.textAlign = data.alignment;
  if (data.border) el.style.border = data.border;
  if (data.otherCSS) {
    data.otherCSS.split(';').forEach(rule => {
      const [key, value] = rule.split(':').map(s => s.trim());
      if (key && value) el.style[key] = value;
    });
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'element';
  wrapper.style.position = 'relative';
  wrapper.appendChild(el);

  const controls = document.createElement('div');
  controls.className = 'controls';

  const editBtn = document.createElement('button');
  editBtn.innerHTML = '🖉';
  editBtn.title = "Edit Element";
  editBtn.classList.add('edit-icon');

  editBtn.onclick = () => {
    currentEditIndex = index;
    deleteElementBtn.style.display = 'inline-block';

    const d = elements[index];
    document.getElementById('elementType').value = d.type;
    document.getElementById('elementText').value = d.text;
    document.getElementById('elementWidth').value = d.width;
    document.getElementById('elementHeight').value = d.height;
    document.getElementById('textColor').value = d.color;
    document.getElementById('bgColor').value = d.bgColor;
    document.getElementById('display').value = d.display;
    document.getElementById('alignment').value = d.alignment;
    document.getElementById('border').value = d.border;
    document.getElementById('otherCSS').value = d.otherCSS;

    form.style.display = 'flex';
    cancelBtn.style.display = 'inline-block';
  };

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.onclick = () => {
    const deleted = elements[index];
    elements.splice(index, 1);
    localStorage.setItem('elements', JSON.stringify(elements));
    renderElements();
    showUndo(index, deleted);
  };

  controls.appendChild(editBtn);
  controls.appendChild(deleteBtn);
  wrapper.appendChild(controls);
  canvas.appendChild(wrapper);

  const iconRect = editBtn.getBoundingClientRect();
  const allIconRects = getAllEditIconRects().filter((_, i) => i !== index);

  for (let r of allIconRects) {
    if (isOverlapping(iconRect, r)) {
      const currentMargin = parseInt(wrapper.style.marginTop) || 0;
      wrapper.style.marginTop = (currentMargin + 20) + 'px';
      alert("Element was moved down to prevent overlap.");
      break;
    }
  }
}

function renderElements() {
  canvas.innerHTML = '';
  elements.forEach((elData, i) => createElementFromData(elData, i));
}

renderElements();

toggleFormBtn.addEventListener('click', () => {
  form.style.display = form.style.display === 'flex' ? 'none' : 'flex';
  deleteElementBtn.style.display = 'none';
  cancelBtn.style.display = 'none';
  currentEditIndex = null;
  form.reset();
});

cancelBtn.addEventListener('click', () => {
  form.reset();
  form.style.display = 'none';
  deleteElementBtn.style.display = 'none';
  cancelBtn.style.display = 'none';
  currentEditIndex = null;
});

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const newElement = {
    type: document.getElementById('elementType').value,
    text: document.getElementById('elementText').value,
    width: document.getElementById('elementWidth').value,
    height: document.getElementById('elementHeight').value,
    color: document.getElementById('textColor').value,
    bgColor: document.getElementById('bgColor').value,
    display: document.getElementById('display').value,
    alignment: document.getElementById('alignment').value,
    border: document.getElementById('border').value,
    otherCSS: document.getElementById('otherCSS').value
  };

  if (currentEditIndex !== null) {
    elements[currentEditIndex] = newElement;
    currentEditIndex = null;
  } else {
    elements.push(newElement);
  }

  localStorage.setItem('elements', JSON.stringify(elements));
  renderElements();
  form.reset();
  form.style.display = 'none';
  deleteElementBtn.style.display = 'none';
  cancelBtn.style.display = 'none';
});

deleteElementBtn.addEventListener('click', function () {
  if (currentEditIndex !== null) {
    const deleted = elements[currentEditIndex];
    const index = currentEditIndex;
    elements.splice(index, 1);
    localStorage.setItem('elements', JSON.stringify(elements));
    renderElements();
    form.reset();
    form.style.display = 'none';
    this.style.display = 'none';
    cancelBtn.style.display = 'none';
    showUndo(index, deleted);
  }
});

undoBtn.addEventListener('click', () => {
  if (deletedElement !== null) {
    elements.splice(deletedElementIndex, 0, deletedElement);
    localStorage.setItem('elements', JSON.stringify(elements));
    renderElements();
    clearInterval(undoTimer);
    undoContainer.style.display = 'none';
    deletedElement = null;
  }
});
