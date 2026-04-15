import { Component, inject, signal, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs';

import { DocumentService } from '../../services';
import { ZoomControlsComponent } from '../zoom-controls';
import { AnnotationComponent } from '../annotation';
import { DocumentInfo, Annotation } from '../../models';
import { getRandomId } from '../../utils';

@Component({
  selector: 'app-document-viewer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ZoomControlsComponent,
    AnnotationComponent,
  ],
  templateUrl: './document-viewer.component.html',
  styleUrl: './document-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentViewerComponent implements OnInit {
  private readonly documentId = inject(ActivatedRoute).snapshot.paramMap.get('id');
  private readonly documentService = inject(DocumentService);

  @ViewChild('pageContainer') pageContainer!: ElementRef;

  protected readonly document = signal<DocumentInfo | null>(null);
  protected readonly zoom = signal(1);
  protected readonly loading = signal(true);
  protected readonly newAnnotationText = signal('');

  
  ngOnInit(): void {
    this.documentService.getDocumentById(this.documentId as string)
      .pipe(take(1))
      .subscribe(doc => this.document.set(doc));
  }

  protected getPageAnnotations(pageNumber: number): Annotation[] {
    const doc = this.document();
    const page = doc?.pages.find(p => p.number === pageNumber);
    return page?.annotations || [];
  }
  
  protected addAnnotation(pageNumber: number, event: MouseEvent): void {
    if (event.shiftKey) {
      const doc = this.document();
      if (!doc) return;
      
      const page = doc.pages.find(p => p.number === pageNumber);
      if (!page) return;
      
      const container = this.pageContainer.nativeElement.getBoundingClientRect();
      const newAnnotation: Annotation = {
        id: getRandomId(),
        text: 'new annotation',
        x: event.offsetX / container.width * 100,
        y: event.offsetY / container.height * 100,
        pageNumber: pageNumber,
      };

      if (!page.annotations) {
        page.annotations = [];
      }
      
      page.annotations.push(newAnnotation);
      this.newAnnotationText.set('');
    }
  }
  
  protected updateAnnotationPosition(pageNumber: number, annotationId: string, position: { x: number; y: number }): void {
    const doc = this.document();
    if (!doc) return;
    
    const page = doc.pages.find(p => p.number === pageNumber);
    const annotation = page?.annotations.find(a => a.id === annotationId);
    
    if (annotation) {
      annotation.x = position.x;
      annotation.y = position.y;
    }
  }
  
  protected updateAnnotationText(pageNumber: number, annotationId: string, text: string): void {
    const doc = this.document();
    if (!doc) return;
    
    const page = doc.pages.find(p => p.number === pageNumber);
    const annotation = page?.annotations.find(a => a.id === annotationId);
    
    if (annotation) {
      annotation.text = text;
    }
  }
  
  protected deleteAnnotation(pageNumber: number, annotationId: string): void {
    const doc = this.document();
    if (!doc) return;
    
    const page = doc.pages.find(p => p.number === pageNumber);
    if (page) {
      page.annotations = page.annotations.filter(a => a.id !== annotationId);
    }
  }
  
  protected saveToConsole(): void {    
    console.log('Документ:', this.document());
  }
}