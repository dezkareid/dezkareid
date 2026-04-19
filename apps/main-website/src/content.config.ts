import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    image: image().optional(),
    techStack: z.array(z.string()),
    githubUrl: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    npmUrl: z.string().url().optional(),
    type: z.enum(['personal', 'work', 'contribution']),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

const servicesCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(),
    cta: z.string().optional(),
    calendlyLink: z.string().optional(),
    order: z.number().default(0),
    metaDescription: z.string().optional(),
    priceRange: z.string().optional(),
    serviceType: z.string().optional(),
  }),
});

export const collections = {
  projects: projectsCollection,
  services: servicesCollection,
};
