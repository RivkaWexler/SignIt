import { SignaturePosition } from './signature.model';

export enum PageSelectionMode {
  ALL_PAGES = 'all-pages',
  FIRST_PAGE = 'first-page',
  LAST_PAGE = 'last-page',
  CUSTOM_RANGE = 'custom-range'
}

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image';
  content: File;
  preview?: string;
  signed?: boolean;
  signedUrl?: string;
  signedBlob?: Blob; // Added to store the actual signed document blob
  signaturePosition?: SignaturePosition;
  pageCount?: number; // Total number of pages in the document
  pageSelectionMode?: PageSelectionMode; // Mode for selecting which pages to sign
  pageStart?: number; // Start page for custom range
  pageEnd?: number; // End page for custom range
}
