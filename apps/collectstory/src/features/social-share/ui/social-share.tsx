'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@dezkareid/components/react';
import { Share, TwitterX, Facebook, Linkedin, Copy, Check } from '@dezkareid/icons/react';
import { DropdownMenu, DropdownMenuItem } from '@/src/shared/ui/dropdown-menu';
import { Toast } from '@/src/shared/ui/toast';
import { getUtmTaggedUrl, copyToClipboard, type EntityType } from '@/src/shared/lib/share-utilities';
import { useAnalytics } from '@/src/shared/lib/analytics/useAnalytics';
import styles from './SocialShare.module.css';

interface SocialShareProperties {
  title: string;
  baseUrl: string;
  entityType: EntityType;
}

export function SocialShare({ title, baseUrl, entityType }: SocialShareProperties) {
  const [isCopied, setIsCopied] = useState(false);
  const { track } = useAnalytics();
  const t = useTranslations('SocialShare');

  const handleTrackShare = useCallback((platform: string) => {
    track({ action: 'share', category: 'social', label: entityType, platform });
  }, [track, entityType]);

  const handleCopyLink = useCallback(async () => {
    const url = getUtmTaggedUrl(baseUrl, 'direct', entityType);
    const success = await copyToClipboard(url);
    if (success) {
      setIsCopied(true);
      handleTrackShare('copy_link');
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [baseUrl, entityType, handleTrackShare]);

  const shareLinks = useMemo(() => ({
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(getUtmTaggedUrl(baseUrl, 'twitter', entityType))}&text=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUtmTaggedUrl(baseUrl, 'facebook', entityType))}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getUtmTaggedUrl(baseUrl, 'linkedin', entityType))}`,
  }), [baseUrl, entityType, title]);

  const trigger = useCallback((open: boolean) => (
    <Button variant="ghost" size="sm" aria-label={t('share_options_aria_label')} aria-expanded={open}>
      <Share />
    </Button>
  ), [t]);

  return (
    <>
      <Toast message={t('link_copied')} visible={isCopied} />
      <DropdownMenu trigger={trigger}>
        <DropdownMenuItem
          variant="anchor"
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleTrackShare('twitter')}
        >
          <div className={styles['social-share-item']}>
            <TwitterX className={styles['social-share-icon']} />
            <span>{t('twitter')}</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="anchor"
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleTrackShare('facebook')}
        >
          <div className={styles['social-share-item']}>
            <Facebook className={styles['social-share-icon']} />
            <span>{t('facebook')}</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="anchor"
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleTrackShare('linkedin')}
        >
          <div className={styles['social-share-item']}>
            <Linkedin className={styles['social-share-icon']} />
            <span>{t('linkedin')}</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem variant="action" onClick={handleCopyLink}>
          <div className={styles['social-share-item']}>
            {isCopied ? <Check className={styles['social-share-icon']} /> : <Copy className={styles['social-share-icon']} />}
            <span>{isCopied ? t('copied') : t('copy_link')}</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenu>
    </>
  );
}
