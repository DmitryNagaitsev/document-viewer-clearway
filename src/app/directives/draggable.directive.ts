import { Directive, ElementRef, Input, output, inject, HostListener, signal } from '@angular/core';

@Directive({
  selector: '[appDraggable]',
  standalone: true
})
export class DraggableDirective {
  private readonly el = inject(ElementRef);
  
  @Input({ required: true }) currentX = 50;
  @Input({ required: true }) currentY = 50;
  @Input({ required: true }) dragBoundary!: HTMLElement;
  @Input() dragHandle?: string;
  
  positionChanged = output<{ x: number; y: number }>();
  dragStarted = output<void>();
  dragEnded = output<void>();
  
  private readonly isDragging = signal(false);
  private startX = 0;
  private startY = 0;
  private handleElement: HTMLElement | null = null;
  
  @HostListener('mousedown', ['$event'])
  protected onMouseDown(event: MouseEvent): void {  
    event.preventDefault();
    this.isDragging.set(true);
    const bounds = this.dragBoundary.getBoundingClientRect();
    this.startX = event.clientX - (this.currentX / 100 * bounds.width);
    this.startY = event.clientY - (this.currentY / 100 * bounds.height);
    
    this.dragStarted.emit();
    
    if (this.handleElement) {
      this.handleElement.style.cursor = 'grabbing';
    }
  }
  
  @HostListener('document:mousemove', ['$event'])
  protected onMouseMove(event: MouseEvent): void {
    if (!this.isDragging()) return;
    
    let newX = event.clientX - this.startX;
    let newY = event.clientY - this.startY;
    
    // Ограничения по границам
    const bounds = this.dragBoundary.getBoundingClientRect();
    const elementBounds = this.el.nativeElement.getBoundingClientRect();
    
    newX = Math.max(0, Math.min(newX, bounds.width - elementBounds.width));
    newY = Math.max(0, Math.min(newY, bounds.height - elementBounds.height));
    
    this.currentX = newX / bounds.width * 100;
    this.currentY = newY / bounds.height * 100;
    
    this.el.nativeElement.style.left = `${this.currentX}%`;
    this.el.nativeElement.style.top = `${this.currentY}%`;
    this.positionChanged.emit({ x: this.currentX, y: this.currentY });
  }
  
  @HostListener('document:mouseup')
  protected onMouseUp(): void {
    if (this.isDragging()) {
      this.isDragging.set(false);
      this.dragEnded.emit();
      
      if (this.handleElement) {
        this.handleElement.style.cursor = 'grab';
      }
    }
  }
}