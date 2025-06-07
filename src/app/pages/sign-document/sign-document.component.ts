import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FileUploadComponent } from '../../components/file-upload/file-upload.component';
import { SignatureUploadComponent } from '../../components/signature-upload/signature-upload.component';
import { DocumentService } from '../../services/document.service';
import { TranslateDirective } from '../../directives/translate.directive';
import { LanguageService } from '../../services/language.service';
import { translations } from '../../models/translations';
import { Document } from '../../models/document.model';
import { Signature } from '../../models/signature.model';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-sign-document',
  standalone: true,
  imports: [CommonModule, FileUploadComponent, SignatureUploadComponent, TranslateDirective],
  templateUrl: './sign-document.component.html',
  styleUrl: './sign-document.component.css'
})
export class SignDocumentComponent {
  // Add translations object
  translations = translations;
  document: Document | null = null;
  signature: Signature | null = null;
  isProcessing: boolean = false;
  error: string | null = null;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    public languageService: LanguageService
  ) {}

  onDocumentSelected(files: FileList): void {
    if (files && files.length > 0) {
      const file = files[0];
      const fileType = this.getDocumentType(file);

      if (!fileType) {
        this.error = 'Invalid file type. Please upload a PDF or image file.';
        return;
      }

      this.documentService.generatePreview(file).then(preview => {
        this.document = {
          id: uuidv4(),
          name: file.name,
          type: fileType,
          content: file,
          preview: preview,
          signed: false
        };
        this.error = null;
      });
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

  async signDocument(): Promise<void> {
    if (!this.document || !this.signature) {
      this.error = 'Please select both a document and a signature.';
      return;
    }

    try {
      this.isProcessing = true;
      const signedDoc = await this.documentService.signDocument(this.document, this.signature);
      this.documentService.setProcessedDocuments([signedDoc]);
      this.documentService.setSignature(this.signature);
      this.router.navigate(['/result']);
    } catch (error) {
      this.error = 'An error occurred while signing the document. Please try again.';
      console.error('Error signing document:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  reset(): void {
    this.document = null;
    this.signature = null;
    this.error = null;
  }
}
