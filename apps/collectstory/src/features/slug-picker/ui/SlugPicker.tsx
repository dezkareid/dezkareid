'use client';

import styles from './SlugPicker.module.css';
import type { SlugOption } from '../model/useSlugDisambiguation';

type Properties = {
  options: SlugOption[];
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
  legend: string;
  hint: string;
};

export function SlugPicker({ options, selectedSlug, onSelect, legend, hint }: Properties) {
  return (
    <fieldset className={styles['slug-picker']}>
      <legend className={styles['slug-picker__legend']}>{legend}</legend>
      <ul className={styles['slug-picker__list']} role="list">
        {options.map(option => (
          <li key={option.slug} className={styles['slug-picker__item']}>
            <label className={styles['slug-picker__label']}>
              <input
                type="radio"
                name="slug-option"
                value={option.slug}
                checked={selectedSlug === option.slug}
                onChange={() => onSelect(option.slug)}
                className={styles['slug-picker__radio']}
                required
              />
              <span className={styles['slug-picker__content']}>
                <code className={styles['slug-picker__slug']}>{option.slug}</code>
                <span className={styles['slug-picker__option-label']}>{option.label}</span>
              </span>
            </label>
          </li>
        ))}
      </ul>
      <p className={styles['slug-picker__hint']}>{hint}</p>
    </fieldset>
  );
}
