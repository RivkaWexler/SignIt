import {Component, EventEmitter, inject, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { TranslateDirective } from '../../directives/translate.directive';
import { v4 as uuidv4 } from 'uuid';
import { Signature } from '../../models/signature.model';
import {translations} from '../../models/translations';
import {LanguageService} from '../../services/language.service';

@Component({
  selector: 'app-signature-upload',
  standalone: true,
  imports: [CommonModule, FileUploadComponent, TranslateDirective],
  templateUrl: './signature-upload.component.html',
  styleUrl: './signature-upload.component.css'
})
export class SignatureUploadComponent {
  @Output() signatureSelected = new EventEmitter<Signature>();

  signature: Signature | null = null;
  drawingMode: boolean = false;
  canvas: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;
  isDrawing = false;
  lastX = 0;
  lastY = 0;

  protected languageService = inject(LanguageService)

  constructor() {}

  ngAfterViewInit(): void {
    this.initializeCanvas();
  }

  private initializeCanvas(): void {
    this.canvas = document.getElementById('signature-canvas') as HTMLCanvasElement;
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      if (this.ctx) {
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#000';
      }
      this.setupCanvasListeners();
    }
  }

  private setupCanvasListeners(): void {
    if (!this.canvas) return;

    this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    this.canvas.addEventListener('mouseup', () => this.stopDrawing());
    this.canvas.addEventListener('mouseout', () => this.stopDrawing());

    // Touch events for mobile
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      this.startDrawing(mouseEvent);
    });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      this.draw(mouseEvent);
    });

    this.canvas.addEventListener('touchend', () => this.stopDrawing());
  }

  toggleDrawingMode(): void {
    this.drawingMode = !this.drawingMode;
    if (this.drawingMode) {
      setTimeout(() => this.initializeCanvas(), 0);
    }
  }

  startDrawing(e: MouseEvent): void {
    if (!this.ctx || !this.canvas) return;
    this.isDrawing = true;

    const rect = this.canvas.getBoundingClientRect();
    this.lastX = e.clientX - rect.left;
    this.lastY = e.clientY - rect.top;
  }

  draw(e: MouseEvent): void {
    if (!this.isDrawing || !this.ctx || !this.canvas) return;

    const rect = this.canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(currentX, currentY);
    this.ctx.stroke();

    this.lastX = currentX;
    this.lastY = currentY;
  }

  stopDrawing(): void {
    this.isDrawing = false;
  }

  clearCanvas(): void {
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  saveSignature(): void {
    if (!this.canvas) return;

    const dataUrl = this.canvas.toDataURL('image/png');
    const signature: Signature = {
      id: uuidv4(),
      type: 'svg',
      content: dataUrl,
      preview: dataUrl
    };

    this.signature = signature;
    this.signatureSelected.emit(signature);
    this.drawingMode = false;
  }

  onFileSelected(files: FileList): void {
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target?.result) {
          const signature: Signature = {
            id: uuidv4(),
            type: 'image',
            content: file,
            preview: e.target.result as string
          };

          this.signature = signature;
          this.signatureSelected.emit(signature);
        }
      };

      reader.readAsDataURL(file);
    }
  }

  removeSignature(): void {
    this.signature = null;
    this.signatureSelected.emit(null as any);
  }

  protected readonly translations = translations;
}
