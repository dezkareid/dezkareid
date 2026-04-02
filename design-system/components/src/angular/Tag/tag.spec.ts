import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TagComponent } from './tag.component';

@Component({
  standalone: true,
  imports: [TagComponent],
  template: '<span db-tag>Tag Label</span>',
})
class TestHostComponent {}

describe('TagComponent', () => {
  it('should render content', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const tagElement = fixture.nativeElement.querySelector('span');
    expect(tagElement.textContent).toContain('Tag Label');
    expect(tagElement.classList.contains('tag')).toBe(true);
    expect(tagElement.classList.contains('tag--default')).toBe(true);
  });

  it('should apply variant class', () => {
    @Component({
      standalone: true,
      imports: [TagComponent],
      template: '<span db-tag variant="success">Success Tag</span>',
    })
    class VariantHostComponent {}

    const fixture = TestBed.createComponent(VariantHostComponent);
    fixture.detectChanges();
    const tagElement = fixture.nativeElement.querySelector('span');
    expect(tagElement.classList.contains('tag--success')).toBe(true);
  });
});
