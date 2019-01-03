//Book class
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//UI class
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">Remove</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(msg, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(msg));

        const container = document.querySelector('.container');

        //get the html element by id
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        //vanish
        setTimeout(() =>
            document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';

    }

}



//store class
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}


//Event:display book
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event:add book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault();

    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //validate
    if (title === '' || author === '' || isbn === '') {
        //alert('Please fill all fields');
        UI.showAlert('Please fill all fields', 'danger')
    } else {
        //instatiate book
        const book = new Book(title, author, isbn);
        console.log(book);

        //add book to list
        UI.addBookToList(book);

        //add book to store
        Store.addBook(book);

        UI.showAlert('Book added','success');

        //clear fields
        UI.clearFields();
    }
});

//Event:remove book
document.querySelector('#book-list').addEventListener('click', (e) => {
    console.log(e.target);
    UI.deleteBook(e.target);

    //remove book from local storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    UI.showAlert('Book removed','danger');
});