const form = document.querySelector('form');
const addBook = document.getElementById('add-book');
const inputTitle = document.querySelector('input[name=title]');
const inputAuthor = document.querySelector('input[name=author]');
const inputPageCount = document.querySelector('input[name=pageCount]');
const inputHasRead = document.querySelector('input[name=hasRead]');
const cards = document.getElementById('cards');
const cardTemplate = document.getElementById("card-template");

class Book {
    constructor(title, author, pageCount, hasRead = false) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.author = author;
        this.pageCount = pageCount;
        this.hasRead = hasRead;
    }

    markRead() {
        this.hasRead = true;
    }
}

class Library {
    #books = [];

    get books() {
        return [...this.#books];
    }

    add(title, author, pageCount, hasRead) {
        this.#books.push(new Book(title, author, pageCount, hasRead));
    }

    remove(id) {
        this.#books = this.#books.filter(b => b.id !== id);
    }

    markRead(id) {
        this.#books.find(b => b.id === id)?.markRead();
    }
}

function createCard(book) {
    const card = cardTemplate.content.firstElementChild.cloneNode(true);
    card.dataset.id = book.id;
    card.querySelector(".title").textContent = book.title;
    card.querySelector(".author").textContent = book.author;
    card.querySelector(".page-count").textContent = `${book.pageCount} pages`;
    card.querySelector(".has-read").textContent = book.hasRead ? "Has been read" : "Not read yet";
    card.querySelector(".button-read").disabled = book.hasRead;
    return card;
}

const library = new Library();

function render() {
    cards.replaceChildren(...library.books.map(createCard));
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = inputTitle.value.trim();
    const author = inputAuthor.value.trim();
    if (!title || !author) return;

    library.add(title, author, Number(inputPageCount.value), inputHasRead.checked);
    form.reset();
    render();
});

cards.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const id = button.closest(".card").dataset.id;
    if (button.dataset.action === "read") library.markRead(id);
    else library.remove(id);
    render();
});

inputPageCount.addEventListener('input', () => {
    inputPageCount.value = inputPageCount.value.replace(/\D/g, '');
});