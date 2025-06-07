import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Document, PageSelectionMode } from '../models/document.model';
import { Signature, SignaturePosition } from '../models/signature.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documents = new BehaviorSubject<Document[]>([]);
  private currentSignature = new BehaviorSubject<Signature | null>(null);
  private processedDocuments = new BehaviorSubject<Document[]>([]);

  constructor() {}

  // Get documents as observable
  getDocuments(): Observable<Document[]> {
    return this.documents.asObservable();
  }

  // Set documents
  setDocuments(documents: Document[]): void {
    this.documents.next(documents);
  }

  // Clear documents
  clearDocuments(): void {
    this.documents.next([]);
  }

  // Get current signature
  getSignature(): Observable<Signature | null> {
    return this.currentSignature.asObservable();
  }

  // Set signature
  setSignature(signature: Signature): void {
    this.currentSignature.next(signature);
  }

  // Clear signature
  clearSignature(): void {
    this.currentSignature.next(null);
  }

  // Get processed documents
  getProcessedDocuments(): Observable<Document[]> {
    return this.processedDocuments.asObservable();
  }

  // Set processed documents
  setProcessedDocuments(documents: Document[]): void {
    this.processedDocuments.next(documents);
  }

  // Sign a single document
  async signDocument(document: Document, signature: Signature): Promise<Document> {
    return new Promise<Document>((resolve) => {
      // Simulate processing time
      setTimeout(async () => { // Make callback async
        try {
          const position = document.signaturePosition || SignaturePosition.BOTTOM_CENTER;
          const pageSelectionMode = document.pageSelectionMode || PageSelectionMode.ALL_PAGES;
          const pageStart = document.pageStart || 1;
          const pageEnd = document.pageEnd || document.pageCount || 1;

          console.log(`Applying signature at position: ${position}, pages: ${pageSelectionMode}`);

          const signedPdf = await this.createSignedPDF(
            document.content,
            signature.content,
            position,
            pageSelectionMode,
            pageStart,
            pageEnd
          );
          // Ensure we create a proper blob with the correct MIME type
          const signedBlob = new Blob([signedPdf], {type: 'application/pdf'});
          // Create object URL from the blob
          const signedUrl = URL.createObjectURL(signedBlob);

          console.log(`Created signed blob for document ${document.name}:`, signedBlob);

          const signedDoc: Document = {
            ...document,
            signed: true,
            signedUrl,
            signedBlob, // Store the blob
            signaturePosition: position
          };
          resolve(signedDoc);
        } catch (error) {
          console.error('Error signing document:', error);
          // Consider rejecting the promise instead of resolving with error
          throw error;
        }
      }, 1000);
    });
  }

  // Sign multiple documents
  async signDocuments(documents: Document[], signature: Signature): Promise<Document[]> {
    const signedDocs: Document[] = [];

    for (const doc of documents) {
      const signedDoc = await this.signDocument(doc, signature);
      signedDocs.push(signedDoc);
    }

    this.setProcessedDocuments(signedDocs);
    return signedDocs;
  }

  // Generate document preview
  generatePreview(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // Get PDF page count
  async getPdfPageCount(file: File): Promise<number> {
    try {
      const { PDFDocument } = await import('pdf-lib');
      const pdfBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      return pdfDoc.getPageCount();
    } catch (error) {
      console.error('Error getting PDF page count:', error);
      return 1; // Default to 1 page if there's an error
    }
  }

  // Save signed document
  saveSignedDocument(document: Document): void {
    if (document.signedUrl) {
      const link = document.type === 'pdf'
        ? document.signedUrl
        : document.signedUrl;

      const a = window.document.createElement('a');
      a.href = link;
      a.download = `signed_${document.name}`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
    }
  }

  // Create a signed PDF with the signature at the specified position and page selection
  private async createSignedPDF(pdfFile: File, signatureContent: File | string, position: SignaturePosition, pageSelectionMode: PageSelectionMode = PageSelectionMode.ALL_PAGES, pageStart: number = 1, pageEnd: number = 1): Promise<Uint8Array> {
    try {
      const { PDFDocument, rgb } = await import('pdf-lib');

      // Convert File to ArrayBuffer
      const pdfBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBuffer);

      // Get all pages
      const pages = pdfDoc.getPages();
      const totalPages = pages.length;

      // Determine which pages to sign based on the page selection mode
      let pagesToSign: number[] = [];

      switch (pageSelectionMode) {
        case PageSelectionMode.FIRST_PAGE:
          pagesToSign = [0]; // First page (index 0)
          break;

        case PageSelectionMode.LAST_PAGE:
          pagesToSign = [totalPages - 1]; // Last page
          break;

        case PageSelectionMode.CUSTOM_RANGE:
          // Convert from 1-based to 0-based indexing and ensure valid range
          const start = Math.max(0, Math.min(pageStart - 1, totalPages - 1));
          const end = Math.max(0, Math.min(pageEnd - 1, totalPages - 1));

          for (let i = start; i <= end; i++) {
            pagesToSign.push(i);
          }
          break;

        case PageSelectionMode.ALL_PAGES:
        default:
          // Sign all pages
          for (let i = 0; i < totalPages; i++) {
            pagesToSign.push(i);
          }
          break;
      }

      // Process each page that needs to be signed
      for (const pageIndex of pagesToSign) {
        const page = pages[pageIndex];
        const { width, height } = page.getSize();

      // Handle different signature content types
      let imageBytes: Uint8Array;
      if (typeof signatureContent === 'string') {
        // If the signature is a base64 string
        // Extract the base64 data part if it's a data URL
        const base64Data = signatureContent.includes('base64,')
          ? signatureContent.split('base64,')[1]
          : signatureContent;

        imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      } else {
        // If the signature is a File
        const arrayBuffer = await signatureContent.arrayBuffer();
        imageBytes = new Uint8Array(arrayBuffer);
      }

      // Embed the image (assuming it's PNG, adjust if needed)
      const signatureImageEmbed = await pdfDoc.embedPng(imageBytes);
      const signatureDims = signatureImageEmbed.scale(0.5); // Scale down the signature to 50%

      // Calculate position based on the selected position
      let xPosition: number;
      let yPosition: number;
      const margin = 50; // Margin from edges

      // Horizontal position
      if (position.includes('left')) {
        xPosition = margin;
      } else if (position.includes('right')) {
        xPosition = width - signatureDims.width - margin;
      } else { // center
        xPosition = (width - signatureDims.width) / 2;
      }

      // Vertical position
      if (position.includes('top')) {
        yPosition = height - signatureDims.height - margin; // From top
      } else if (position.includes('middle')) {
        yPosition = (height - signatureDims.height) / 2;
      } else { // bottom
        yPosition = margin; // From bottom
      }

        // Draw the signature on the current page
        page.drawImage(signatureImageEmbed, {
          x: xPosition,
          y: yPosition,
          width: signatureDims.width,
          height: signatureDims.height,
        });
      }

      // Save the document
      return await pdfDoc.save();
    } catch (error) {
      console.error('Error creating signed PDF:', error);
      throw new Error('Failed to create signed PDF');
    }
  }
}
