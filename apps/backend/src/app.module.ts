import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AcceptLanguageResolver, I18nModule, I18nJsonLoader } from "nestjs-i18n";
import { HealthModule } from "./health/health.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { RedisModule } from "./redis/redis.module";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { TenantMiddleware } from "./common/middleware/tenant.middleware";
import * as path from "path";

@Module({
  imports: [
    HealthModule,
    PrismaModule,
    RedisModule,
    AuthModule,
    I18nModule.forRoot({
      fallbackLanguage: "ar",
      loaderOptions: {
        path: path.join(__dirname, "/i18n/"),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
      loader: I18nJsonLoader,
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes("*");
  }
}
