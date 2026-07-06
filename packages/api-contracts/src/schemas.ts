import { z } from "zod";

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const CharitySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  locale: z.enum(["ar", "en"]),
  isActive: z.boolean(),
});

export const UserSchema = z.object({
  id: z.string().uuid(),
  charityId: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(["admin", "manager", "viewer"]),
  isActive: z.boolean(),
});

export const IndigentSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string().min(1),
  dateOfBirth: z.string(),
  nationalId: z.string().min(1),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type Charity = z.infer<typeof CharitySchema>;
export type User = z.infer<typeof UserSchema>;
export type Indigent = z.infer<typeof IndigentSchema>;
