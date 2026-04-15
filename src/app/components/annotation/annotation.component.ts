import { Component, input, output, signal, inject, ElementRef, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DraggableDirective } from '../../directives';
import { Annotation } from '../../models/document.model';

@Component({
  selector: 'app-annotation',
  standalone: true,
  imports: [FormsModule, DraggableDirective],
  templateUrl: './annotation.component.html',
  styleUrl: './annotation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnotationComponent {
  private elementRef = inject(ElementRef);
  
  annotation = input.required<Annotation>();
  containerElement = input.required<HTMLElement>();
  zoom = input.required<number>();
  
  delete = output<string>();
  textChanged = output<string>();
  positionChanged = output<{ x: number; y: number }>();
  
  protected readonly isEditing = signal(false);
  protected readonly isDragging = signal(false);
  protected readonly editText = signal('');

  @HostListener('click', ['$event'])
  protected onClick(event: MouseEvent): void {
    event.stopPropagation();
  }
  
  protected startEdit(): void {
    this.isEditing.set(true);
    this.editText.set(this.annotation().text);
    
    setTimeout(() => {
      const textarea = this.elementRef.nativeElement.querySelector('textarea');
      textarea?.focus();
    });
  }
  
  protected saveEdit(): void {
    const newText = this.editText().trim();
    if (newText && newText !== this.annotation().text) {
      this.textChanged.emit(newText);
    }
    this.isEditing.set(false);
  }
  
  protected cancelEdit(): void {
    this.isEditing.set(false);
  }
  
  protected onPositionChanged(position: { x: number; y: number }): void {
    this.positionChanged.emit(position);
  }
}