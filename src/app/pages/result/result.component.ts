import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {DocumentService} from '../../services/document.service';
import {Document} from '../../models/document.model';
import {Signature, SignaturePosition} from '../../models/signature.model';
import {TranslationService} from '../../services/translation.service';
import {LanguageService} from '../../services/language.service';
import {translations} from '../../models/translations';
import {LanguageSwitcherComponent} from '../../components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule, FormsModule, LanguageSwitcherComponent],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent implements OnInit {
  documents: Document[] = [];
  signature: Signature | null = null;
  savePath: string = '';
  isSingleDocument: boolean = false;
  hasPdfDocuments: boolean = false;
  hasImageDocuments: boolean = false;

  // Expose enum to template
  SignaturePosition = SignaturePosition;

  // Add translations object
  translations = translations;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private translationService: TranslationService,
    public languageService: LanguageService
  ) {
  }

  ngOnInit(): void {
    this.documentService.getProcessedDocuments().subscribe(docs => {
      this.documents = docs;
      this.isSingleDocument = docs.length === 1;

      // Check for PDF and image documents
      this.hasPdfDocuments = docs.some(doc => doc.type === 'pdf');
      this.hasImageDocuments = docs.some(doc => doc.type === 'image');
    });

    this.documentService.getSignature().subscribe(signature => {
      this.signature = signature;
    });

    // If no documents are processed, redirect to home
    if (this.documents.length === 0) {
      this.router.navigate(['/']);
    }
  }

  downloadDocument(document: Document): void {
    if (document.signedUrl) {
      const link = document.signedUrl;
      const a = window.document.createElement('a');
      a.href = link;
      a.download = `signed_${document.name}`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
    }
  }

  downloadAllDocuments(): void {
    // For a real implementation, this would need to create a zip file
    // For this demo, we'll just download each document individually
    this.documents.forEach(doc => {
      this.downloadDocument(doc);
    });
  }

  startNewProcess(): void {
    this.documentService.clearDocuments();
    this.documentService.setProcessedDocuments([]);
    this.router.navigate(['/']);
  }

  async saveToLocation(): Promise<void> {
    try {
      const currentLang = this.languageService.getCurrentLanguage();

      // Check for File System Access API support
      if (!('showDirectoryPicker' in window)) {
        alert(this.translations[currentLang].browser_not_supported);
        return;
      }

      // Check if we're on a secure context (HTTPS or localhost)
      if (!window.isSecureContext) {
        alert(this.translations[currentLang].secure_context_required);
        return;
      }

      // Let user pick a directory
      const dirHandle = await (window as any).showDirectoryPicker();

      // Save each document to the selected directory
      const savedFiles = [];
      const failedFiles = [];

      for (const doc of this.documents) {
        // Check if we have a blob or URL to convert to blob
        if (!doc.signedBlob && !doc.signedUrl) {
          console.error(`No blob or URL found for document: ${doc.name}`);
          failedFiles.push(doc.name);
          continue;
        }

        try {
          // If we don't have a blob but have a URL, create blob from URL
          let blobToSave = doc.signedBlob;
          if (!blobToSave && doc.signedUrl) {
            // Create a blob from the URL
            try {
              const response = await fetch(doc.signedUrl);
              blobToSave = await response.blob();
              console.log(`Created blob from URL for document: ${doc.name}`, blobToSave);
            } catch (fetchError) {
              console.error(`Error creating blob from URL for document: ${doc.name}:`, fetchError);
              failedFiles.push(doc.name);
              continue;
            }
          }

          // Create a file in the directory
          const fileHandle = await dirHandle.getFileHandle(`signed_${doc.name}`, {create: true});

          // Get a writable stream
          const writable = await fileHandle.createWritable();

          // Write the blob to the file
          await writable.write(blobToSave);

          // Close the stream
          await writable.close();

          savedFiles.push(doc.name);
          console.log(`Successfully saved file: ${doc.name}`);
        } catch (fileError) {
          console.error(`Error saving file ${doc.name}:`, fileError);
          failedFiles.push(doc.name);
        }
      }

      if (savedFiles.length > 0) {
        if (failedFiles.length > 0) {
          alert(this.translations[currentLang].documents_saved_failed + savedFiles.length.toString() + failedFiles.join(', '));
        } else {
          alert(this.translations[currentLang].documents_saved + savedFiles.length.toString());
        }
      } else {
        alert(this.translations[currentLang].no_documents_saved);
      }

    } catch (error: any) {
      // User likely canceled the directory picker or another error occurred
      console.error('Error saving documents:', error);
      if (error.name !== 'AbortError') {
        const currentLang = this.languageService.getCurrentLanguage();
        alert(this.translations[currentLang].error_signing);
      }
    }
  }
}
