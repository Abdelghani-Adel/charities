import { z } from "zod";

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export interface LoginResponse {
  token: string;
  expiresAt: string;
}

export interface LoginErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  retryAfterSeconds?: number;
}
