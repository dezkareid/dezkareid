import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  template: `
    <button
      [class]="buttonClasses"
      [disabled]="disabled()"
      [attr.aria-disabled]="disabled()"
    >
      <ng-content></ng-content>
    </button>
  `,
  styleUrl: './button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  disabled = input<boolean>(false);

  get buttonClasses(): string {
    const classes = ['button'];
    
    if (this.variant()) {
      classes.push(`button--${this.variant()}`);
    }
    
    if (this.size()) {
      classes.push(`button--${this.size()}`);
    }
    
    if (this.disabled()) {
      classes.push('button--disabled');
    }
    
    return classes.join(' ');
  }
}
