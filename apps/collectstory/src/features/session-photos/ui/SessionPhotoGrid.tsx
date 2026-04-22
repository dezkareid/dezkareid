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
import Image from 'next/image';
import { getCloudinaryUrl } from '@/lib/image/cloudinary';
import { deleteSessionPhoto } from '@/app/[locale]/[username]/sessions/[sessionSlug]/actions';
import type { SessionPhoto } from '@/lib/sessions';
import styles from './SessionPhotoGrid.module.css';

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

  const thumbUrl = getCloudinaryUrl(photo.image_url, 400) ?? photo.image_url;

  return (
    <div ref={setNodeRef} style={style} className={styles['photo-grid__item']} {...attributes}>
      <div className={styles['photo-grid__image-wrapper']} {...listeners}>
        <Image
          src={thumbUrl}
          alt=""
          fill
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
};

export function SessionPhotoGrid({ sessionId, username, sessionSlug, initialPhotos, isOwner }: Properties) {
  const [photos, setPhotos] = useState<SessionPhoto[]>(initialPhotos);
  const [mounted, setMounted] = useState(false);
  const reorderTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  /* eslint-disable @eslint-react/hooks-extra/no-direct-set-state-in-use-effect */
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setPhotos(initialPhotos);
  }, [initialPhotos]);
  /* eslint-enable @eslint-react/hooks-extra/no-direct-set-state-in-use-effect */

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      setPhotos((previous) => {
        const oldIndex = previous.findIndex(p => p.id === active.id);
        const newIndex = previous.findIndex(p => p.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return previous;

        const reordered = [...previous];
        const [moved] = reordered.splice(oldIndex, 1);
        reordered.splice(newIndex, 0, moved);

        // Debounced auto-save
        clearTimeout(reorderTimerRef.current);
        reorderTimerRef.current = setTimeout(async () => {
          await fetch(`/api/sessions/${sessionId}/photos/reorder`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderedIds: reordered.map(p => p.id) }),
          });
        }, 300);

        return reordered;
      });
    },
    [sessionId],
  );

  const handleDelete = useCallback((id: string) => {
    setPhotos(previous => previous.filter(p => p.id !== id));
  }, []);

  const staticGrid = (
    <div className={styles['photo-grid']}>
      {photos.map((photo) => {
        const thumbUrl = getCloudinaryUrl(photo.image_url, 400) ?? photo.image_url;
        return (
          <div key={photo.id} className={styles['photo-grid__item']}>
            <div className={styles['photo-grid__image-wrapper']}>
              <Image
                src={thumbUrl}
                alt=""
                fill
                sizes="(max-width: 640px) 45vw, 200px"
                className={styles['photo-grid__image']}
              />
            </div>
          </div>
        );
      })}
    </div>
  );

  if (!isOwner) return staticGrid;

  // Render static grid on first paint to match server HTML, swap to DnD after mount
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
