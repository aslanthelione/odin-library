const form = document.querySelector('form');
const addBook = document.getElementById('add-book');
const inputTitle = document.querySelector('input[name=title]');
const inputAuthor = document.querySelector('input[name=author]');
const inputPageCount = document.querySelector('input[name=pageCount]');
const inputHasRead = document.querySelector('input[name=hasRead]');
const cards = document.getElementById('cards');

const myLibrary = [];

class Book {
    constructor(title, author, pageCount, read = false) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.author = author;
        this.pageCount = pageCount;
        this.hasRead = read;
    }
}

function addBookToLibrary(title, author, pageCount, hasRead = false) {
    myLibrary.push(new Book(title, author, pageCount, hasRead));
    displayLibrary();
}

function displayLibrary() {
    cards.replaceChildren(...myLibrary.map(createCard));
}

function makeEl(tagName, className, textContent = "") {
    const el = document.createElement(tagName);
    el.className = className;
    el.textContent = textContent;

    return el;
}

function createCard(book) {
    const card = makeEl('div', 'card');
    card.setAttribute("data-id", book.id);

    const info = makeEl('div', 'info');
    const title = makeEl('h2', 'title', book.title);
    const author = makeEl('p', 'author', book.author);
    const pageCount = makeEl('p', 'page-count', book.pageCount + ' pages');
    const hasRead = makeEl('p', 'has-read', book.hasRead ? "Has been read" : "Not read yet");
    const cardActions = makeEl('div', 'card-actions');

    const buttonRead = makeEl('button', 'button-read', 'Read')
    buttonRead.disabled = book.hasRead;
    buttonRead.dataset.action = 'read';

    const buttonDelete = makeEl('button', 'button-delete', 'Delete');
    buttonDelete.dataset.action = 'delete';

    cardActions.appendChild(buttonRead);
    cardActions.appendChild(buttonDelete);

    info.appendChild(title);
    info.appendChild(author);
    info.appendChild(pageCount);
    info.appendChild(hasRead);

    card.appendChild(info);
    card.appendChild(cardActions);

    return card;
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = inputTitle.value.trim();
    const author = inputAuthor.value.trim();
    if (!title || !author) return;
    addBookToLibrary(title, author, +inputPageCount.value, inputHasRead.checked);
    form.reset();
});

cards.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const id = button.closest('.card').dataset.id;
    if (button.dataset.action === 'read') {
        myLibrary.find(b => b.id === id).hasRead = true;
    } else {
        myLibrary.splice(myLibrary.findIndex(b => b.id === id), 1);
    }
    displayLibrary();
});

inputPageCount.addEventListener('input', () => {
    inputPageCount.value = inputPageCount.value.replace(/\D/g, '');
});
