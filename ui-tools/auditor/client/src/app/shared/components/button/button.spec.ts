import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.ts';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default classes', () => {
    const btnElement: HTMLElement = fixture.nativeElement.querySelector('button');
    expect(btnElement.classList.contains('button')).toBe(true);
    expect(btnElement.classList.contains('button--primary')).toBe(true);
    expect(btnElement.classList.contains('button--md')).toBe(true);
  });
});
