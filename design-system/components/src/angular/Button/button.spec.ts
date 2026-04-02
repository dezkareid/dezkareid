import { describe, it, expect } from 'vitest';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

@Component({
  standalone: true,
  imports: [ButtonComponent],
  template: '<button db-button>Click me</button>',
})
class TestHostComponent {}

describe('ButtonComponent', () => {
  it('should render content', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.textContent).toContain('Click me');
    expect(buttonElement.classList.contains('button')).toBe(true);
    expect(buttonElement.classList.contains('button--primary')).toBe(true);
  });

  it('should apply size class', () => {
    @Component({
      standalone: true,
      imports: [ButtonComponent],
      template: '<button db-button size="sm">Small</button>',
    })
    class SizeHostComponent {}

    const fixture = TestBed.createComponent(SizeHostComponent);
    fixture.detectChanges();
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.classList.contains('button--sm')).toBe(true);
  });
});
