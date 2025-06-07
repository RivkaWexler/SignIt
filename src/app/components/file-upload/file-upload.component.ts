import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {translations} from '../../models/translations';
import {TranslateDirective} from '../../directives/translate.directive';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, TranslateDirective],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent {
  translations = translations;
  @Input() acceptedTypes: string = '';
  @Input() multiple: boolean = false;
  @Input() label: string = 'Upload Files';
  @Input() dropzoneText: string = 'Drag & Drop files here or click to browse';
  @Input() allowFolders: boolean = false;
  @Output() filesSelected = new EventEmitter<FileList>();

  isHovering: boolean = false;
  selectedFiles: File[] = [];

  constructor() {
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isHovering = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isHovering = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isHovering = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFiles(files);
    }
  }

  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFiles(input.files);
    }
  }

  private handleFiles(files: FileList): void {
    // If not accepting multiple files, only take the first file
    if (!this.multiple && files.length > 1) {
      const singleFileList = new DataTransfer();
      singleFileList.items.add(files[0]);
      this.filesSelected.emit(singleFileList.files);
      this.selectedFiles = [files[0]];
    } else {
      this.filesSelected.emit(files);
      this.selectedFiles = Array.from(files);
    }
  }

  triggerFileInput(folderMode: boolean = false): void {
    // Remove existing input element if it exists
    const existingInput = document.getElementById('file-input');
    if (existingInput) {
      existingInput.remove();
    }

    // Create a new input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'file-input';
    fileInput.classList.add('hidden-input');
    fileInput.multiple = this.multiple;
    fileInput.accept = this.acceptedTypes;

    // Set directory attributes if in folder mode
    if (folderMode) {
      fileInput.setAttribute('webkitdirectory', '');
      fileInput.setAttribute('directory', '');
    }

    // Add change event listener
    fileInput.addEventListener('change', (event) => {
      this.onFileInputChange(event);
    });

    // Append to DOM and trigger click
    document.body.appendChild(fileInput);
    fileInput.click();
  }
}
