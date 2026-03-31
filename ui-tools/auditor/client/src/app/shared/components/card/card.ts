import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CardElevation = 'flat' | 'raised';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses" [attr.role]="role()">
      <ng-content></ng-content>
    </div>
  `,
  styleUrl: './card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  elevation = input<CardElevation>('raised');
  role = input<string | null>(null);

  get cardClasses(): string {
    const classes = ['card'];
    
    if (this.elevation()) {
      classes.push(`card--${this.elevation()}`);
    }
    
    return classes.join(' ');
  }
}
