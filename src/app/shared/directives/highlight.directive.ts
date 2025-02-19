import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective {
  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    const element = this.elRef.nativeElement;
    const innerText = element.value?.trim();

    if (element && isNaN(Number(innerText))) {
      this.renderer.setStyle(element, 'backgroundColor', 'orange');
    }
  }
}
