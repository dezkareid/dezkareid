'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { DropdownMenu } from '@/src/shared/ui/dropdown-menu';
import { DropdownMenuItem } from '@/src/shared/ui/dropdown-menu';
import { DropdownDivider } from '@/src/shared/ui/dropdown-menu';
import { renameSession, deleteSession } from '@/app/[locale]/[username]/sessions/actions';
import styles from './SessionActionsMenu.module.css';

type Properties = {
  sessionId: string;
  sessionName: string;
  username: string;
};

export function SessionActionsMenu({ sessionId, sessionName, username }: Properties) {
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(sessionName);
  const [renameError, setRenameError] = useState<string | undefined>(undefined);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleRenameSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newName.trim() || newName.trim() === sessionName) {
      setRenaming(false);
      return;
    }
    setRenameError(undefined);
    startTransition(async () => {
      const result = await renameSession(username, sessionId, newName.trim());
      if (result.error) {
        setRenameError(result.error);
        return;
      }
      setRenaming(false);
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteSession(username, sessionId);
      router.push(`/${username}/sessions`);
    });
  };

  const handleRenameOpen = () => {
    setRenaming(true);
    setNewName(sessionName);
  };

  return (
    <>
      <DropdownMenu
        trigger={(
          <button type="button" className={styles['actions-trigger']} aria-label="Session actions">
            ···
          </button>
        )}
      >
        <DropdownMenuItem variant="action" onClick={handleRenameOpen}>
          Rename
        </DropdownMenuItem>
        <DropdownDivider />
        <DropdownMenuItem variant="action" onClick={() => setConfirmDelete(true)}>
          Delete session
        </DropdownMenuItem>
      </DropdownMenu>

      {renaming && (
        <div className={styles['rename-overlay']} role="dialog" aria-modal="true" aria-label="Rename session">
          <div className={styles['rename-modal']}>
            <h3 className={styles['rename-modal__title']}>Rename session</h3>
            <form onSubmit={handleRenameSubmit} className={styles['rename-modal__form']}>
              <input
                type="text"
                value={newName}
                onChange={event => setNewName(event.target.value)}
                className={styles['rename-modal__input']}
                maxLength={120}
                required
                autoFocus
                aria-label="New session name"
              />
              {renameError && <p className={styles['rename-modal__error']} role="alert">{renameError}</p>}
              <div className={styles['rename-modal__actions']}>
                <button type="button" className={styles['rename-modal__cancel']} onClick={() => setRenaming(false)} disabled={isPending}>
                  Cancel
                </button>
                <button type="submit" className={styles['rename-modal__confirm']} disabled={isPending || !newName.trim()}>
                  {isPending ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className={styles['rename-overlay']} role="dialog" aria-modal="true" aria-label="Delete session">
          <div className={styles['rename-modal']}>
            <h3 className={styles['rename-modal__title']}>
              Delete &ldquo;
              {sessionName}
              &rdquo;?
            </h3>
            <p className={styles['rename-modal__body']}>This will permanently delete the session and all its photos.</p>
            <div className={styles['rename-modal__actions']}>
              <button type="button" className={styles['rename-modal__cancel']} onClick={() => setConfirmDelete(false)} disabled={isPending}>
                Cancel
              </button>
              <button type="button" className={`${styles['rename-modal__confirm']} ${styles['rename-modal__confirm--danger']}`} onClick={handleDelete} disabled={isPending}>
                {isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
