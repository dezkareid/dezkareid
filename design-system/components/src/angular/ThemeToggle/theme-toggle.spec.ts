import { TestBed } from '@angular/core/testing';
import { ThemeToggleComponent } from './theme-toggle.component';

describe('ThemeToggleComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeToggleComponent],
    }).compileComponents();
  });

  it('should render correctly', () => {
    const fixture = TestBed.createComponent(ThemeToggleComponent);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button).toBeTruthy();
    expect(button.textContent).toMatch(/light|dark/i);
  });

  it('should toggle theme on click', () => {
    const fixture = TestBed.createComponent(ThemeToggleComponent);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    const initialLabel = button.textContent.trim();

    button.click();
    fixture.detectChanges();

    const newLabel = button.textContent.trim();
    expect(newLabel).not.toBe(initialLabel);
  });
});
