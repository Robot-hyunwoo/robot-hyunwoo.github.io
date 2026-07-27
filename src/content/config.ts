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
const visionCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		order: z.number(), // roadmap sequence number
		part: z.string(), // e.g. "Part 0. 수학 기반 (선형대수·기하)"
		difficulty: z.string(), // 기초 | 중급 | 심화
		reference: z.string().optional().default(""), // core reference
		url: z.string().optional().default(""), // Notion source page
	}),
});
export const collections = {
	posts: postsCollection,
	spec: specCollection,
	interests: interestsCollection,
	problems: problemsCollection,
	vision: visionCollection,
};
