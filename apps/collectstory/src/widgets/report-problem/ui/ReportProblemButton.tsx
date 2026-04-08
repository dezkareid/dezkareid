'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@dezkareid/components/react';
import { Info } from '@dezkareid/icons/react';
import styles from './ReportProblemButton.module.css';

export function ReportProblemButton() {
  const pathname = usePathname();

  const handleReport = () => {
    const email = 'elmaildeldezkareid@gmail.com';
    const subject = encodeURIComponent('Problem Report - Collectstory');
    const url = `${globalThis.location.origin}${pathname}`;
    const body = encodeURIComponent(`I encountered a problem on page: ${url}\n\nDescription:\n`);

    globalThis.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className={styles.container}>
      <Button
        variant="secondary"
        size="md"
        onClick={handleReport}
        className={styles.button}
        aria-label="Report a problem"
      >
        <Info className={styles.icon} />
        <span>Report</span>
      </Button>
    </div>
  );
}
