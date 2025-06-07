import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {TranslationService} from '../../services/translation.service';
import {LanguageService} from '../../services/language.service';
import {translations} from '../../models/translations';
import {LanguageSwitcherComponent} from '../../components/language-switcher/language-switcher.component';
import {FormsModule} from '@angular/forms';
import {FileUploadComponent} from '../../components/file-upload/file-upload.component';
import {SignatureUploadComponent} from '../../components/signature-upload/signature-upload.component';
import {DocumentService} from '../../services/document.service';
import {Document, PageSelectionMode} from '../../models/document.model';
import {Signature, SignaturePosition} from '../../models/signature.model';
import {v4 as uuidv4} from 'uuid';
import {TranslateDirective} from '../../directives/translate.directive';

@Component({
  selector: 'app-sign-folder',
  standalone: true,
  imports: [CommonModule, FormsModule, FileUploadComponent, SignatureUploadComponent, LanguageSwitcherComponent, TranslateDirective],
  templateUrl: './sign-folder.component.html',
  styleUrl: './sign-folder.component.css'
})
export class SignFolderComponent {
  // Add translations object
  translations = translations;
  documents: Document[] = [];
  signature: Signature | null = null;
  isProcessing: boolean = false;
  error: string | null = null;
  processingProgress: number = 0;
  signaturePosition: SignaturePosition = SignaturePosition.BOTTOM_CENTER;
  signaturePositionOptions = Object.values(SignaturePosition);

  // Page selection options
  pageSelectionMode: PageSelectionMode = PageSelectionMode.ALL_PAGES;
  pageSelectionModeOptions = Object.values(PageSelectionMode);
  pageStart: number = 1;
  pageEnd: number = 1;
  showCustomRange: boolean = false;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private translationService: TranslationService,
    public languageService: LanguageService
  ) {
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  async onDocumentsSelected(files: FileList): Promise<void> {
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    // Check for valid file types
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileType = this.getDocumentType(file);

      if (fileType) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    }
    // console.log('Valid files:', validFiles, invalidFiles);
    // // Show error for invalid files
    // if (invalidFiles.length > 0) {
    //   this.error = `Invalid file types: ${invalidFiles.join(', ')}. Only PDF and image files are accepted.`;
    // } else {
    //   this.error = null;
    // }

    // Process valid files
    if (validFiles.length > 0) {
      // Create a new array to store processed documents
      const newDocuments: Document[] = [];

      for (const file of validFiles) {
        const fileType = this.getDocumentType(file) as 'pdf' | 'image';
        const preview = await this.documentService.generatePreview(file);

        // Get page count for PDF documents
        let pageCount = 1;
        if (fileType === 'pdf') {
          pageCount = await this.documentService.getPdfPageCount(file);
        }

        newDocuments.push({
          id: uuidv4(),
          name: file.name,
          type: fileType,
          content: file,
          preview: preview,
          signed: false,
          pageCount: pageCount,
          pageSelectionMode: PageSelectionMode.ALL_PAGES,
          pageStart: 1,
          pageEnd: pageCount
        });
      }

      // Append new documents to existing ones
      this.documents = [...this.documents, ...newDocuments];
    }
  }

  onSignatureSelected(signature: Signature): void {
    this.signature = signature;
  }

  private getDocumentType(file: File): 'pdf' | 'image' | null {
    const fileType = file.type.toLowerCase();

    if (fileType === 'application/pdf') {
      return 'pdf';
    } else if (fileType.startsWith('image/')) {
      return 'image';
    }

    return null;
  }

  async signDocuments(): Promise<void> {
    const currentLang = this.languageService.getCurrentLanguage();

    if (this.documents.length === 0 || !this.signature) {
      this.error = this.translations[currentLang].select_docs_signature;
      return;
    }

    try {
      this.isProcessing = true;
      this.processingProgress = 0;

      const processedDocs: Document[] = [];
      const totalDocs = this.documents.length;

      for (let i = 0; i < totalDocs; i++) {
        const doc = this.documents[i];
        // Apply the selected signature position to the document
        doc.signaturePosition = this.signaturePosition;

        // Apply the page selection mode if not already set
        if (!doc.pageSelectionMode) {
          doc.pageSelectionMode = this.pageSelectionMode;

          if (this.pageSelectionMode === PageSelectionMode.CUSTOM_RANGE) {
            doc.pageStart = this.pageStart;
            doc.pageEnd = Math.min(this.pageEnd, doc.pageCount || 1);
          }
        }

        const signedDoc = await this.documentService.signDocument(doc, this.signature);
        processedDocs.push(signedDoc);
        this.processingProgress = Math.round(((i + 1) / totalDocs) * 100);
      }

      this.documentService.setProcessedDocuments(processedDocs);
      this.documentService.setSignature(this.signature);
      this.router.navigate(['/result']);
    } catch (error) {
      const currentLang = this.languageService.getCurrentLanguage();
      this.error = this.translations[currentLang].error_signing;
      console.error('Error signing documents:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  removeDocument(index: number): void {
    this.documents.splice(index, 1);
  }

  clearAllDocuments(): void {
    this.documents = [];
  }

  reset(): void {
    this.documents = [];
    this.signature = null;
    this.error = null;
    this.processingProgress = 0;
  }

  onPageSelectionModeChange(mode: PageSelectionMode): void {
    this.pageSelectionMode = mode;
    this.showCustomRange = mode === PageSelectionMode.CUSTOM_RANGE;

    // Apply the selection to all documents
    this.documents.forEach(doc => {
      doc.pageSelectionMode = mode;

      if (mode === PageSelectionMode.CUSTOM_RANGE) {
        // Set default range values if not already set
        if (!this.pageStart) this.pageStart = 1;
        if (!this.pageEnd) this.pageEnd = doc.pageCount || 1;

        doc.pageStart = this.pageStart;
        doc.pageEnd = this.pageEnd;
      }
    });
  }

  updatePageRange(): void {
    // Validate and apply the custom page range to all documents
    const start = Math.max(1, this.pageStart);
    const end = Math.min(this.pageEnd, this.getMaxPageCount());

    this.pageStart = start;
    this.pageEnd = end;

    this.documents.forEach(doc => {
      if (doc.pageSelectionMode === PageSelectionMode.CUSTOM_RANGE) {
        doc.pageStart = start;
        doc.pageEnd = Math.min(end, doc.pageCount || 1);
      }
    });
  }

  getMaxPageCount(): number {
    // Find the maximum page count among all documents
    let maxPages = 1;
    this.documents.forEach(doc => {
      if (doc.pageCount && doc.pageCount > maxPages) {
        maxPages = doc.pageCount;
      }
    });
    return maxPages;
  }

  hasMultiPageDocuments(): boolean {
    // Check if there are any documents with more than 1 page
    if (this.documents.length === 0) return false;

    for (const doc of this.documents) {
      if ((doc.pageCount || 1) > 1) {
        return true;
      }
    }
    return false;
  }

  triggerFileUpload(folderMode: boolean = false): void {
    // Create a hidden file input element to trigger file selection
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = 'application/pdf,image/*';

    // Enable directory selection if folderMode is true
    if (folderMode) {
      fileInput.setAttribute('webkitdirectory', '');
      fileInput.setAttribute('directory', '');
    }

    // Handle file selection
    fileInput.addEventListener('change', async (event) => {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        // Keep existing documents and add new ones
        await this.onDocumentsSelected(input.files);
      }
    });

    // Trigger click on the file input
    fileInput.click();
  }
}
