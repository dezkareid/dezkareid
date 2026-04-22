'use client';

import { useEffect } from 'react';

type Options = {
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
};

export function useKeyboardNav({ onNext, onPrevious, onClose }: Options) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') onNext();
      if (event.key === 'ArrowLeft') onPrevious();
      if (event.key === 'Escape') onClose();
    };
    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrevious, onClose]);
}
