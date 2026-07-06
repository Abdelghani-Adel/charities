import { Controller, Post, Body, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Public } from "./public.decorator";

@Controller("auth")
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @Public()
  @Post("login")
  async login(@Body() loginDto: { email: string; password: string }) {
    // TODO: Replace with real user validation from database
    if (loginDto.email === "admin@charity.com" && loginDto.password === "password") {
      const payload = { sub: "user-1", email: loginDto.email, charityId: "charity-1", role: "admin" };
      return {
        status: "success",
        data: { accessToken: this.jwtService.sign(payload) },
      };
    }
    throw new UnauthorizedException("Invalid credentials");
  }
}
