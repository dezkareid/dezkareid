'use client';

import { useState } from 'react';
import { Button } from '@dezkareid/components/react';
import { Shelves } from '@dezkareid/icons/react';
import { useAnalytics } from '@/src/shared/lib/analytics/useAnalytics';
import { useSessionPhotos } from '@/src/features/session-photos/model/SessionPhotosContext';
import { SessionExplorerView } from './SessionExplorerView';

export function SessionExploreButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { track } = useAnalytics();
  const { photos, sessionName, sessionId } = useSessionPhotos();

  if (photos.length === 0) return null;

  const handleOpen = () => {
    setIsOpen(true);
    track({ action: 'explore_session_open', category: 'engagement', label: sessionId });
  };

  return (
    <>
      <Button variant="secondary" onClick={handleOpen}>
        <Shelves style={{ marginRight: 'var(--spacing-8)' }} />
        Explore session
      </Button>

      {isOpen && (
        <SessionExplorerView
          photos={photos}
          sessionName={sessionName}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
