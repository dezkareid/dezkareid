import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TagVariant = 'default' | 'success' | 'danger' | 'warning';

@Component({
  selector: 'app-tag',
  imports: [CommonModule],
  template: `
    <span [class]="tagClasses">
      <ng-content></ng-content>
    </span>
  `,
  styleUrl: './tag.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
  variant = input<TagVariant>('default');

  get tagClasses(): string {
    const classes = ['tag'];
    
    if (this.variant()) {
      classes.push(`tag--${this.variant()}`);
    }
    
    return classes.join(' ');
  }
}
