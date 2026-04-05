import type { Metadata } from 'next';
import { FranchiseForm } from '@/components/admin/FranchiseForm';
import { createFranchise } from '../actions';
import styles from '../../form.module.css';

export const metadata: Metadata = { title: 'New Franchise' };

export default function NewFranchisePage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>New Franchise</h1>
      <FranchiseForm action={createFranchise} cancelHref="/admin/franchises" submitLabel="Create Franchise" />
    </div>
  );
}
