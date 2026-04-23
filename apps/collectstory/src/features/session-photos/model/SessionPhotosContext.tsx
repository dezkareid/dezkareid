'use client';

import { createContext, use, useState, useCallback, type ReactNode } from 'react';
import type { SessionPhoto } from '@/lib/sessions';

type SessionPhotosContextValue = {
  photos: SessionPhoto[];
  sessionName: string;
  sessionId: string;
  addPhoto: (photo: SessionPhoto) => void;
  removePhoto: (id: string) => void;
  setPhotos: (photos: SessionPhoto[]) => void;
};

const SessionPhotosContext = createContext<SessionPhotosContextValue | null>(null);

export function SessionPhotosProvider({
  initialPhotos,
  sessionName,
  sessionId,
  children,
}: {
  initialPhotos: SessionPhoto[];
  sessionName: string;
  sessionId: string;
  children: ReactNode;
}) {
  const [photoList, setPhotoList] = useState<SessionPhoto[]>(initialPhotos);

  const addPhoto = useCallback((photo: SessionPhoto) => {
    setPhotoList(previous => [...previous, photo]);
  }, []);

  const removePhoto = useCallback((id: string) => {
    setPhotoList(previous => previous.filter(p => p.id !== id));
  }, []);

  const setPhotos = useCallback((next: SessionPhoto[]) => {
    setPhotoList(next);
  }, []);

  return (
    <SessionPhotosContext value={{ photos: photoList, sessionName, sessionId, addPhoto, removePhoto, setPhotos }}>
      {children}
    </SessionPhotosContext>
  );
}

export function useSessionPhotos(): SessionPhotosContextValue {
  const context = use(SessionPhotosContext);
  if (!context) throw new Error('useSessionPhotos must be used inside SessionPhotosProvider');
  return context;
}
