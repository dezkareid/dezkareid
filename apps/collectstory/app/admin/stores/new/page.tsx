import type { Metadata } from 'next';
import { StoreForm } from '@/components/admin/StoreForm';
import { createStore } from '../actions';
import styles from '../../form.module.css';

export const metadata: Metadata = { title: 'New Store' };

export default function NewStorePage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>New Store</h1>
      <StoreForm action={createStore} submitLabel="Create Store" />
    </div>
  );
}
