export interface DocumentInfo {
  name: string;
  pages: Page[];
}

export interface Page {
  number: number;
  imageUrl: string;
  annotations: Annotation[];
}

export interface Annotation {
  id: string;
  text: string;
  x: number;
  y: number;
  pageNumber: number;
}