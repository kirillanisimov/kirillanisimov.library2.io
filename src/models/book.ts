export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  genre: 'Detective' | 'Fantasy' | 'Novel' | 'Poetry';
}

export const defaultBooks: Book[] = [
  {
    id: '1',
    title: "Mock Turtle: 'why.",
    author: "Madelyn Mertz",
    description: "Alice: 'I don't know of any use, now,' thought poor Alice...",
    genre: "Fantasy"
  },
 
];