import type { ComponentType, SVGProps } from 'react';
import { Box, Chart, Share } from '@dezkareid/icons/react';

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { label?: string }>;

export const siteData = {
  name: 'collectstory',
  logoIcon: 'shelves',
  copyrightYear: 2026,
  navLinks: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Contact', href: 'mailto:elmaildeldezkareid@gmail.com' },
  ],
};

export const heroData = {
  badge: 'New: Catalog your 2024 sets',
  title: 'Every piece has a story.',
  description: 'The modern home for collectors. Organise, track, and showcase your trading cards, action figures, and rare finds in a delightful digital vault.',
  ctaPrimary: { label: 'Start your collection', href: '#' },
  images: [
    {
      src: 'https://res.cloudinary.com/ddyovtxd2/image/upload/v1776196233/A80D42C4-8CE4-4FD8-AFD3-5827B132E503_1_105_c_cvbdmk.jpg',
      alt: 'Collectible figures',
    },
    {
      src: 'https://res.cloudinary.com/ddyovtxd2/image/upload/v1776196287/074787A5-57AF-425A-AC0C-5C6BB4430A4C_1_105_c_phehos.jpg',
      alt: 'Trading cards',
    },
    {
      src: 'https://res.cloudinary.com/ddyovtxd2/image/upload/v1776196360/A142697F-1EBA-4019-95F9-F5EB3742C448_1_105_c_brvrr3.jpg',
      alt: 'Gaming figures',
    },
  ],
};

export const statsData = [
  { value: '500k+', label: 'Items Cataloged' },
  { value: '12k+', label: 'Active Vaults' },
  { value: '98%', label: 'Match Rate' },
  { value: '24/7', label: 'Price Tracking' },
];

export const latestArrivals = [
  {
    title: 'Charizard Base Set',
    author: '@PokeMaster99',
    category: 'TCG',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5N7yb1M21rko1J8uelSGKHWqnsR6OfLAE7l6S4scZsz6tiQM7fZXYo37c-V5nMuPnrjcGL88pnHaX79EaCqEgr-ARaF_m6u9Pqfrziu8UwqV9releKOp_xqQLa8KRKCFeerx6KNpHcOJgotaucSVBGslzAAzleX4zDLYOV6YhmGN8xGDbrNDgXX52mSdh64miX3S-nknzj6Npzb_Rx1vgFo879vc_m9uLitKQvhhCMO4k-RAV6_nuSxEeR2Ig97wOvpPf7UxVw9ww',
  },
  {
    title: 'Hot Toys Iron Man MK85',
    author: '@MarvelFanatic',
    category: 'FIGURE',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBH4APoKk3KBu3bd38omVdawFZ6mGP-YUzC5pYrVvlKPOh5T9qSqEIsHmVvFhhmgyJofvHXuBh7EC5URPgrd6n-2uveqE1rRH4XQ10ZKcDxbgn98LiTgxtrhPQARas-Ip5oGcjjanywgJHULgNwn7M9A3h7rgxu-SioKAZtAxHbD-xKQY4Ncvk7PzO8Xhg4obyKb0TbR4Oa67i74ly6k9yO8_GWiHwveQ41NM1zLZwAjjKJmU1sD5iULhTPRCs9-3hUIMP3ouE73NR9',
  },
  {
    title: 'Kaws Companion Open Edition',
    author: '@HypeBeast88',
    category: 'VINYL',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3KphpLKgJYwEIYJRGEcmXq7bFh9-nFYGUXHhaKdAZVaMrd-P3uLlGzeTppf4b5LeRRBHyzO118FvVnhyjxLvfWaO7mb9i1whZ8NNGopiGYKV92zusMXK7lW-7Os3ri9mVnQ-DXGJWL9j-F-79jORmMkzyxPruF5wc-ULsGzd-5aTzs_U8rZj3sZWgepxoSJ60TenJYapox28z8sMAw2Afu9-QjD1n5AVnfkActTnJSd6_iMszV4HD2GezlHlqo59vIR8QuRO0t1HD',
  },
  {
    title: 'Amazing Fantasy #15',
    author: '@SpideyCollector',
    category: 'COMIC',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5IItgmxF5KJBubAYh5rwPMPOFafUbl9KnqLsKe6eQR7gairdrpOyI-Zaa20BoQdIAi13TpWlJGR4YmtBGs-dtCQY1fKfBJfudGpGOPTEQZBQrzc6ccYyEq507pbzwGIRR1KMo5dHjL1PaA94hM6wwrQyP0xjdResCGKn0zSs9KN1M57Aw3RuTqR6kDEYR6hyLfMB8tPggj-S0KfLvW4DG4lCTQnX4wHR42CN1b1yM9KU2XDq0jeyEQnHqm9--tDwV7LqxCecNsgK3',
  },
];

export const features: Array<{ title: string; description: string; icon: IconComponent; color: string }> = [
  {
    title: 'AI Inventory',
    description: 'Snap a photo and let our AI recognize and catalog your item instantly with market data.',
    icon: Box,
    color: 'blue',
  },
  {
    title: 'Value Tracking',
    description: 'Stay updated with real-time price trends from major marketplaces and auction houses.',
    icon: Chart,
    color: 'indigo',
  },
  {
    title: 'Public Vaults',
    description: 'Share your curated collection with the world through a beautiful, customizable landing page.',
    icon: Share,
    color: 'purple',
  },
];

export const ctaSection = {
  title: 'Ready to showcase your journey?',
  description: 'Join over 100,000 collectors who trust collectstory with their most prized possessions.',
  buttonLabel: 'Join Now',
};
