import { Component, model, computed, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-zoom-controls',
  standalone: true,
  templateUrl: './zoom-controls.component.html',
  styleUrl: './zoom-controls.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZoomControlsComponent {
  zoom = model.required<number>();
  protected minZoom = 0.20;
  protected maxZoom = 2;
  private zoomStep = 0.1;
  private readonly eps = 0.001; 
  
  protected zoomPercent = computed(() => `${(100 * this.zoom()).toFixed(0)}%`);
  
  protected zoomIn(): void {
    if (this.zoom() + this.zoomStep <= this.maxZoom + this.eps) {
      this.zoom.update(z => z + this.zoomStep);
    }
  }
  
  protected zoomOut(): void {
    if (this.zoom() - this.zoomStep >= this.minZoom - this.eps) {
      this.zoom.update(z => z - this.zoomStep);
    }
  }
}