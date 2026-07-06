import { Controller, Post, Body, Req, UseGuards } from "@nestjs/common";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { AuthService } from "./auth.service";
import { Public } from "./public.decorator";
import { Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @Post("login")
  async login(
    @Body() loginDto: { email: string; password: string },
    @Req() req: Request,
  ) {
    const ipAddress = req.ip ?? req.socket.remoteAddress ?? "unknown";
    return this.authService.login(loginDto.email, loginDto.password, ipAddress);
  }
}
