'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Image } from '@dezkareid/components/react';
import { deleteSessionPhoto } from '@/app/[locale]/[username]/sessions/[sessionSlug]/actions';
import { SessionPhotoStaticGrid } from './SessionPhotoStaticGrid';
import type { SessionPhoto } from '@/lib/sessions';
import styles from './SessionPhotoGrid.module.css';

// Separate controlled component for owner grid to avoid lifting state into hooks
type ControlledGridProperties = {
  sessionId: string;
  username: string;
  sessionSlug: string;
  photos: SessionPhoto[];
  onPhotosChange: (photos: SessionPhoto[]) => void;
};

type SortablePhotoProperties = {
  photo: SessionPhoto;
  username: string;
  sessionSlug: string;
  onDelete: (id: string) => void;
};

function SortablePhoto({ photo, username, sessionSlug, onDelete }: SortablePhotoProperties) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: photo.id });
  const [deleting, setDeleting] = useState(false);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (deleting) return;
    setDeleting(true);
    try {
      await deleteSessionPhoto(username, sessionSlug, photo.id);
      onDelete(photo.id);
    }
    catch {
      setDeleting(false);
    }
  };

  return (
    <div ref={setNodeRef} style={style} className={styles['photo-grid__item']} {...attributes}>
      <div className={styles['photo-grid__image-wrapper']} {...listeners}>
        <Image
          src={photo.image_url}
          alt=""
          strategy="cloudinary"
          sizes="(max-width: 640px) 45vw, 200px"
          className={styles['photo-grid__image']}
        />
        <div className={styles['photo-grid__drag-hint']} aria-hidden="true">⠿</div>
      </div>
      <button
        type="button"
        className={styles['photo-grid__delete']}
        onClick={handleDelete}
        disabled={deleting}
        aria-label="Delete photo"
      >
        {deleting ? '…' : '✕'}
      </button>
    </div>
  );
}

type Properties = {
  sessionId: string;
  username: string;
  sessionSlug: string;
  initialPhotos: SessionPhoto[];
  isOwner: boolean;
  onPhotosChange?: (photos: SessionPhoto[]) => void;
};

function OwnerPhotoGrid({ sessionId, username, sessionSlug, photos, onPhotosChange }: ControlledGridProperties) {
  const [mounted, setMounted] = useState(false);
  const reorderTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  /* eslint-disable @eslint-react/hooks-extra/no-direct-set-state-in-use-effect */
  useEffect(() => {
    setMounted(true);
  }, []);
  /* eslint-enable @eslint-react/hooks-extra/no-direct-set-state-in-use-effect */

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = photos.findIndex(p => p.id === active.id);
      const newIndex = photos.findIndex(p => p.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = [...photos];
      const [moved] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, moved);
      onPhotosChange(reordered);

      clearTimeout(reorderTimerRef.current);
      reorderTimerRef.current = setTimeout(async () => {
        await fetch(`/api/sessions/${sessionId}/photos/reorder`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderedIds: reordered.map(p => p.id) }),
        });
      }, 300);
    },
    [sessionId, photos, onPhotosChange],
  );

  const handleDelete = useCallback((id: string) => {
    onPhotosChange(photos.filter(p => p.id !== id));
  }, [photos, onPhotosChange]);

  const staticGrid = (
    <div className={styles['photo-grid']}>
      {photos.map(photo => (
        <div key={photo.id} className={styles['photo-grid__item']}>
          <div className={styles['photo-grid__image-wrapper']}>
            <Image src={photo.image_url} alt="" strategy="cloudinary" sizes="(max-width: 640px) 45vw, 200px" className={styles['photo-grid__image']} />
          </div>
        </div>
      ))}
    </div>
  );

  if (!mounted) return staticGrid;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={photos.map(p => p.id)} strategy={rectSortingStrategy}>
        <div className={styles['photo-grid']}>
          {photos.map(photo => (
            <SortablePhoto
              key={photo.id}
              photo={photo}
              username={username}
              sessionSlug={sessionSlug}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export function SessionPhotoGrid({ username, sessionSlug, initialPhotos, isOwner, sessionId, onPhotosChange }: Properties) {
  if (!isOwner) {
    return <SessionPhotoStaticGrid photos={initialPhotos} />;
  }

  return (
    <OwnerPhotoGrid
      sessionId={sessionId}
      username={username}
      sessionSlug={sessionSlug}
      photos={initialPhotos}
      onPhotosChange={onPhotosChange ?? (() => {})}
    />
  );
}
