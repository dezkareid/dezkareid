import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/components/card/card.ts';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, CardComponent],
  template: `
    <div class="settings">
      <h1>Settings</h1>
      <app-card>
        <p>Global settings will be here.</p>
      </app-card>
    </div>
  `,
  styles: [`
    .settings {
      padding: var(--spacing-24);
    }
    h1 {
      margin-bottom: var(--spacing-24);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {}
