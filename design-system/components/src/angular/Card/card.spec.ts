import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';

@Component({
  standalone: true,
  imports: [CardComponent],
  template: '<div db-card>Card Content</div>',
})
class TestHostComponent {}

describe('CardComponent', () => {
  it('should render content', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const cardElement = fixture.nativeElement.querySelector('div');
    expect(cardElement.textContent).toContain('Card Content');
    expect(cardElement.classList.contains('card')).toBe(true);
    expect(cardElement.classList.contains('card--raised')).toBe(true);
  });

  it('should apply elevation class', () => {
    @Component({
      standalone: true,
      imports: [CardComponent],
      template: '<div db-card elevation="flat">Flat Card</div>',
    })
    class ElevationHostComponent {}

    const fixture = TestBed.createComponent(ElevationHostComponent);
    fixture.detectChanges();
    const cardElement = fixture.nativeElement.querySelector('div');
    expect(cardElement.classList.contains('card--flat')).toBe(true);
  });
});
