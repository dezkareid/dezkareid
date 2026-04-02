import {
  Component,
  computed,
  input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'span[db-tag]',
  standalone: true,
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClasses()',
  },
})
export class TagComponent {
  variant = input<'default' | 'success' | 'danger' | 'warning'>('default');

  // eslint-disable-next-line unicorn/consistent-function-scoping
  computedClasses = computed(() => this._getClasses());

  private _getClasses() {
    const variantValue = this.variant();
    return `tag tag--${variantValue}`;
  }
}
