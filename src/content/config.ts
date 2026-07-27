import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		image: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		category: z.string().optional().nullable().default(""),
		lang: z.string().optional().default(""),

		/* For internal use */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});
const specCollection = defineCollection({
	schema: z.object({}),
});
const interestsCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		updated: z.date(),
	}),
});
const problemsCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		site: z.string(), // 백준 | 프로그래머스 | LeetCode ...
		source: z.string().optional().default(""), // 대회/출처 (e.g. 2025 카카오 하반기 2차)
		level: z.string().optional().default(""), // Lv.2 | Gold IV ...
		languages: z.array(z.string()).optional().default([]),
		algorithms: z.array(z.string()).optional().default([]),
		date: z.date(), // 문제 푼 날짜
		url: z.string().optional().default(""), // 문제 원본 링크
	}),
});
export const collections = {
	posts: postsCollection,
	spec: specCollection,
	interests: interestsCollection,
	problems: problemsCollection,
};
