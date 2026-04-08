'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@dezkareid/components/react';
import { Share, TwitterX, Facebook, Linkedin, Copy, Check } from '@dezkareid/icons/react';
import { DropdownMenu, DropdownMenuItem } from '@/src/shared/ui/dropdown-menu';
import { shareUrl, canUseWebShare, getUtmTaggedUrl, copyToClipboard, type EntityType } from '@/src/shared/lib/share-utilities';
import styles from './SocialShare.module.css';

interface SocialShareProperties {
  title: string;
  text: string;
  baseUrl: string;
  entityType: EntityType;
}

export function SocialShare({ title, text, baseUrl, entityType }: SocialShareProperties) {
  const [isClient, setIsClient] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    React.startTransition(() => {
      setIsClient(true);
    });
  }, []);

  const handleNativeShare = async () => {
    const url = getUtmTaggedUrl(baseUrl, 'direct', entityType);
    await shareUrl(title, text, url);
  };

  const handleCopyLink = async () => {
    const url = getUtmTaggedUrl(baseUrl, 'direct', entityType);
    const success = await copyToClipboard(url);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const getShareLink = (platform: 'twitter' | 'facebook' | 'linkedin') => {
    const url = getUtmTaggedUrl(baseUrl, platform, entityType);
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    switch (platform) {
      case 'twitter': {
        return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
      }
      case 'facebook': {
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      }
      case 'linkedin': {
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
      }
      default: {
        return '';
      }
    }
  };

  // SSR Fallback
  if (!isClient) {
    return (
      <Button variant="ghost" size="sm" aria-label="Share">
        <Share />
      </Button>
    );
  }

  // Use native Share API if available (mobile/modern desktop)
  if (canUseWebShare()) {
    return (
      <Button variant="ghost" size="sm" onClick={handleNativeShare} aria-label="Share">
        <Share />
      </Button>
    );
  }

  // Fallback to custom dropdown for desktop browsers without Web Share API
  return (
    <DropdownMenu
      trigger={open => (
        <Button variant="ghost" size="sm" aria-label="Share options" aria-expanded={open}>
          <Share />
        </Button>
      )}
    >
      <DropdownMenuItem variant="anchor" href={getShareLink('twitter')} target="_blank" rel="noopener noreferrer">
        <div className={styles['social-share-item']}>
          <TwitterX className={styles['social-share-icon']} />
          <span>Twitter (X)</span>
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem variant="anchor" href={getShareLink('facebook')} target="_blank" rel="noopener noreferrer">
        <div className={styles['social-share-item']}>
          <Facebook className={styles['social-share-icon']} />
          <span>Facebook</span>
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem variant="anchor" href={getShareLink('linkedin')} target="_blank" rel="noopener noreferrer">
        <div className={styles['social-share-item']}>
          <Linkedin className={styles['social-share-icon']} />
          <span>LinkedIn</span>
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem variant="action" onClick={handleCopyLink}>
        <div className={styles['social-share-item']}>
          {isCopied
            ? (
                <Check className={styles['social-share-icon']} />
              )
            : (
                <Copy className={styles['social-share-icon']} />
              )}
          <span>{isCopied ? 'Copied!' : 'Copy Link'}</span>
        </div>
      </DropdownMenuItem>
    </DropdownMenu>
  );
}
