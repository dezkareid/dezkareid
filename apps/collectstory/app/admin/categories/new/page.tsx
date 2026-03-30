import type { Metadata } from 'next';
import { NameOnlyForm } from '@/components/admin/NameOnlyForm';
import { createCategory } from '../actions';
import styles from '../../form.module.css';

export const metadata: Metadata = { title: 'New Category' };

export default function NewCategoryPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>New Category</h1>
      <NameOnlyForm action={createCategory} cancelHref="/admin/categories" submitLabel="Create Category" />
    </div>
  );
}
