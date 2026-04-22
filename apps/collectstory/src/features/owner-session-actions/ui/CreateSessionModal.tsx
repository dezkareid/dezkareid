'use client';

import { useState, useTransition } from 'react';
import { Button } from '@dezkareid/components/react';
import { createSession } from '@/app/[locale]/[username]/sessions/actions';
import { useAnalytics } from '@/src/shared/lib/analytics/useAnalytics';
import styles from './CreateSessionModal.module.css';

const MAX_SESSIONS = 5;

type Properties = {
  username: string;
  sessionCount: number;
};

export function CreateSessionModal({ username, sessionCount }: Properties) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();
  const { track } = useAnalytics();

  const atLimit = sessionCount >= MAX_SESSIONS;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;

    setError(undefined);
    startTransition(async () => {
      const result = await createSession(username, name.trim(), description.trim() || undefined);
      if (result.error) {
        setError(result.error);
        return;
      }
      track({ action: 'create_session', category: 'engagement', label: username });
      setName('');
      setDescription('');
      setIsOpen(false);
    });
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setError(undefined);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="primary"
        onClick={() => setIsOpen(true)}
        disabled={atLimit}
        aria-disabled={atLimit}
      >
        {atLimit ? `Limit of ${MAX_SESSIONS} sessions reached` : 'New session'}
      </Button>

      {isOpen && (
        <div className={styles['modal-overlay']} role="dialog" aria-modal="true" aria-labelledby="create-session-title">
          <div className={styles.modal}>
            <h2 id="create-session-title" className={styles['modal__title']}>New photo session</h2>

            <form onSubmit={handleSubmit} className={styles['modal__form']}>
              <div className={styles['modal__field']}>
                <label htmlFor="session-name" className={styles['modal__label']}>Name *</label>
                <input
                  id="session-name"
                  type="text"
                  value={name}
                  onChange={event => setName(event.target.value)}
                  className={styles['modal__input']}
                  placeholder="e.g. Outdoor shoot"
                  maxLength={120}
                  required
                  autoFocus
                />
              </div>

              <div className={styles['modal__field']}>
                <label htmlFor="session-description" className={styles['modal__label']}>Description</label>
                <textarea
                  id="session-description"
                  value={description}
                  onChange={event => setDescription(event.target.value)}
                  className={styles['modal__textarea']}
                  placeholder="Optional description"
                  rows={3}
                  maxLength={500}
                />
              </div>

              {error && <p className={styles['modal__error']} role="alert">{error}</p>}

              <div className={styles['modal__actions']}>
                <Button type="button" variant="secondary" onClick={handleClose} disabled={isPending}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isPending || !name.trim()}>
                  {isPending ? 'Creating…' : 'Create session'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
