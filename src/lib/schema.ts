import { z } from "zod";

export const leadSchema = z.object({
  hp: z.string().optional(),               // honeypot
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  company: z.string().max(200).optional().or(z.literal("")),
  url: z.string().url().max(300).optional().or(z.literal("")),
  service: z.string().max(120).optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),
});

export type Lead = z.infer<typeof leadSchema>;
