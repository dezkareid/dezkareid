import {
  Component,
  computed,
  input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'div[db-card]',
  standalone: true,
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClasses()',
  },
})
export class CardComponent {
  elevation = input<'flat' | 'raised'>('raised');

  // eslint-disable-next-line unicorn/consistent-function-scoping
  computedClasses = computed(() => this._getClasses());

  private _getClasses() {
    const elevationValue = this.elevation();
    return `card card--${elevationValue}`;
  }
}
