import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		image: z.string().optional(),
		techStack: z.array(z.string()),
		githubUrl: z.string().url().optional(),
		liveUrl: z.string().url().optional(),
		featured: z.boolean().default(false),
		order: z.number().default(0),
	}),
});

const servicesCollection = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		icon: z.string().optional(),
		order: z.number().default(0),
	}),
});

export const collections = {
	'projects': projectsCollection,
	'services': servicesCollection,
};
