import { Directive, ElementRef, AfterViewInit } from '@angular/core';
import { DominantColorService } from '../services/dominant-color.service';

@Directive({
  selector: '[applyContrast]'
})
export class ApplyContrastDirective implements AfterViewInit {

  constructor(
    private el: ElementRef<HTMLElement>,
    private colorService: DominantColorService
  ) {}

  async ngAfterViewInit() {
    const style = window.getComputedStyle(this.el.nativeElement);
    const bgImage = style.backgroundImage;

    if (!bgImage || bgImage === 'none') return;

    // Extract URL from css: url("img.jpg")
    const match = bgImage.match(/url\(["']?(.*?)["']?\)/);
    if (!match) return;

    const imgSrc = match[1];

    try {
      const rgb = await this.colorService.getDominantColor(imgSrc);
      const contrast = this.colorService.getContrastingColor(rgb);
      this.el.nativeElement.style.color = contrast;
    } catch (err) {
      console.error(err);
    }
  }
}
