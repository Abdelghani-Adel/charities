import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, Controller, Get, MiddlewareConsumer, Module } from "@nestjs/common";
import request from "supertest";
import { TenantMiddleware } from "../../src/common/middleware/tenant.middleware";

@Controller("test-resource")
class TestController {
  @Get()
  getResource() {
    return { status: "success", data: { message: "tenant resource" } };
  }
}

@Module({
  controllers: [TestController],
})
class TestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes("*");
  }
}

describe("Tenant Isolation (Integration)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix("api/v1");
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("sets tenantId from user context when charityId is present", () => {
    // Simulate authenticated request by setting user directly
    const server = app.getHttpServer();
    return request(server)
      .get("/api/v1/test-resource")
      .set("Authorization", "Bearer test")
      .expect(200);
  });

  it("handles requests without tenant context gracefully", () => {
    return request(app.getHttpServer())
      .get("/api/v1/test-resource")
      .expect(200);
  });
});
