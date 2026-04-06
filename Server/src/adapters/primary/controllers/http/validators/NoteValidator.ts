import { z } from "zod";

export const createNoteSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Title is required").max(100, "Title is too long"),
        content: z.string().min(1, "Content is required"),
        tags: z.preprocess((val) => {
            if (typeof val === "string") return val.split(",").map(t => t.trim());
            return val;
        }, z.array(z.string())).optional().default([]),
        reporter: z.string().email("Invalid reporter email").optional(),
    }),
});

export const updateNoteSchema = z.object({
    params: z.object({
        id: z.string().min(1, "ID is required"),
    }),
    body: z.object({
        title: z.string().min(1).max(100).optional(),
        content: z.string().min(1).optional(),
        tags: z.array(z.string()).optional(),
        reporter: z.string().email().optional(),
    }),
});
