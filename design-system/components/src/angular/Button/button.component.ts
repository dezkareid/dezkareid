import {
  Component,
  computed,
  input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'button[db-button], a[db-button]',
  standalone: true,
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClasses()',
    '[attr.aria-disabled]': 'disabled()',
    '[attr.disabled]': 'disabled() ? \'disabled\' : null',
  },
})
export class ButtonComponent {
  variant = input<'primary' | 'secondary' | 'outline' | 'ghost' | 'success'>('primary');
  size = input<'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large'>('md');
  disabled = input<boolean>(false);

  // eslint-disable-next-line unicorn/consistent-function-scoping
  computedClasses = computed(() => this._getClasses());

  private _getClasses() {
    const variantValue = this.variant();
    const sizeValue = this.size();
    const disabledValue = this.disabled();

    return [
      'button',
      `button--${variantValue}`,
      `button--${sizeValue}`,
      disabledValue ? 'button--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }
}
