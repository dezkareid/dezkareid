import type { Metadata } from 'next';
import { NameOnlyForm } from '@/components/admin/NameOnlyForm';
import { createBrand } from '../actions';
import styles from '../../form.module.css';

export const metadata: Metadata = { title: 'New Brand' };

export default function NewBrandPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>New Brand</h1>
      <NameOnlyForm action={createBrand} cancelHref="/admin/brands" submitLabel="Create Brand" />
    </div>
  );
}
