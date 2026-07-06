import { Injectable, UnauthorizedException, HttpException, Inject } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { I18nContext } from "nestjs-i18n";
import { compare } from "bcrypt";
import Redis from "ioredis";
import { UsersService } from "../users/users.service";
import { REDIS_CLIENT } from "../redis/redis.module";

const LOCKOUT_THRESHOLD = parseInt(process.env.LOCKOUT_THRESHOLD ?? "5");
const LOCKOUT_DURATION_MS = parseInt(process.env.LOCKOUT_DURATION_MS ?? "900000");

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(REDIS_CLIENT) private redis: Redis,
  ) {}

  private t(key: string, args?: Record<string, any>): string {
    const ctx = I18nContext.current();
    if (ctx) {
      return ctx.t(key, args);
    }
    return key;
  }

  private async logAudit(userId: string | null, email: string, ipAddress: string, success: boolean, failureReason?: string) {
    const entry = JSON.stringify({
      userId,
      email,
      ipAddress,
      attemptedAt: new Date().toISOString(),
      success,
      failureReason,
    });
    await this.redis.lpush("audit:login", entry);
    await this.redis.ltrim("audit:login", 0, 9999);
  }

  async login(email: string, password: string, ipAddress: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user || !user.isActive) {
      await this.logAudit(null, email, ipAddress, false, "invalid_email");
      throw new UnauthorizedException(this.t("auth.invalid_credentials"));
    }

    const lockoutKey = `lockout:${user.id}`;
    const lockoutData = await this.redis.get(lockoutKey);

    if (lockoutData) {
      const { lockedUntil } = JSON.parse(lockoutData);
      const remainingMs = lockedUntil - Date.now();
      if (remainingMs > 0) {
        await this.logAudit(user.id, email, ipAddress, false, "account_locked");
        throw new HttpException(
          {
            statusCode: 423,
            message: this.t("auth.account_locked", { minutes: Math.ceil(remainingMs / 60000) }),
            error: "Locked",
            retryAfterSeconds: Math.ceil(remainingMs / 1000),
          },
          423,
        );
      }
      await this.redis.del(lockoutKey);
    }

    const passwordValid = await compare(password, user.passwordHash);
    if (!passwordValid) {
      const failuresKey = `failures:${user.id}`;
      const attempts = await this.redis.incr(failuresKey);
      if (attempts === 1) {
        await this.redis.expire(failuresKey, LOCKOUT_DURATION_MS / 1000);
      }
      if (attempts >= LOCKOUT_THRESHOLD) {
        const lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
        await this.redis.set(
          lockoutKey,
          JSON.stringify({ lockedUntil }),
          "PX",
          LOCKOUT_DURATION_MS,
        );
        await this.redis.del(failuresKey);
        await this.logAudit(user.id, email, ipAddress, false, "lockout_triggered");
        throw new HttpException(
          {
            statusCode: 423,
            message: this.t("auth.account_locked", { minutes: Math.ceil(LOCKOUT_DURATION_MS / 60000) }),
            error: "Locked",
            retryAfterSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
          },
          423,
        );
      }
      await this.logAudit(user.id, email, ipAddress, false, "invalid_password");
      throw new UnauthorizedException(this.t("auth.invalid_credentials"));
    }

    await this.redis.del(`failures:${user.id}`);
    await this.redis.del(lockoutKey);

    const payload = {
      sub: user.id,
      email: user.email,
      charityId: user.charityId,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);
    const expiresInSec = parseInt(process.env.JWT_EXPIRATION_SECONDS ?? "86400");

    await this.logAudit(user.id, email, ipAddress, true);

    return {
      token,
      expiresAt: new Date(Date.now() + expiresInSec * 1000).toISOString(),
    };
  }
}
