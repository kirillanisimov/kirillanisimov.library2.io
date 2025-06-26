import './style.css';
import { Book, defaultBooks } from './models/book';

//DOM элементы
const content = document.querySelector('.content') as HTMLElement;
const addBtn = document.querySelector('.add') as HTMLButtonElement;
const modal = document.querySelector('.modal') as HTMLElement;
const closeBtn = modal.querySelector('.close') as HTMLButtonElement;
const form = modal.querySelector('form') as HTMLFormElement;

class BookApp {
  private books: Book[] = [];
  private currentEditId: string | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    this.loadBooks();
    this.setupEventListeners();
    this.displayBooks();
  }

  private loadBooks(): void {
    const saved = localStorage.getItem('books');
    this.books = saved ? JSON.parse(saved) : [...defaultBooks];
    if (!saved) {
      localStorage.setItem('books', JSON.stringify(this.books));
    }
  }

  private saveBooks(): void {
    localStorage.setItem('books', JSON.stringify(this.books));
  }

  private setupEventListeners(): void {
    addBtn.addEventListener('click', () => {
      this.currentEditId = null;
      modal.style.display = 'flex';
      form.reset();
    });

    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });
  }

  private handleFormSubmit(): void {
    const formData = new FormData(form);
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const genre = formData.get('genre') as Book['genre'];
    const description = formData.get('description') as string;

    if (!title || !author || !description) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    if (this.currentEditId) {
      // Редакт сущ книги
      const book = this.books.find(b => b.id === this.currentEditId);
      if (book) {
        book.title = title;
        book.author = author;
        book.genre = genre;
        book.description = description;
      }
    } else {
      // Добавление новой книги
      const newBook: Book = {
        id: Date.now().toString(),
        title,
        author,
        genre,
        description
      };
      this.books.push(newBook);
    }

    this.saveBooks();
    this.displayBooks();
    modal.style.display = 'none';
  }

  private displayBooks(): void {
    if (!content) return;

    content.innerHTML = this.books.map(book => `
      <div class="card" data-id="${book.id}">
        <h3>${book.title}</h3>
        <h4>${book.author}</h4>
        <p>${book.description.length > 50 ? 
          book.description.substring(0, 50) + '...' : 
          book.description}</p>
        <small data-genre="${book.genre}">${book.genre}</small>
        <div>
          <button class="edit" data-id="${book.id}">Редактировать</button>
          <button class="delete" data-id="${book.id}">Удалить</button>
        </div>
      </div>
    `).join('');

    this.setupCardButtons();
  }

  private setupCardButtons(): void {
    document.querySelectorAll('.delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).dataset.id;
        if (id) {
          this.books = this.books.filter(book => book.id !== id);
          this.saveBooks();
          this.displayBooks();
        }
      });
    });

    document.querySelectorAll('.edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).dataset.id;
        const book = this.books.find(b => b.id === id);
        if (book) {
          this.currentEditId = id || null;
          (form.elements.namedItem('title') as HTMLInputElement).value = book.title;
          (form.elements.namedItem('author') as HTMLInputElement).value = book.author;
          (form.elements.namedItem('genre') as HTMLSelectElement).value = book.genre;
          (form.elements.namedItem('description') as HTMLTextAreaElement).value = book.description;
          modal.style.display = 'flex';
        }
      });
    });
  }
}

new BookApp();