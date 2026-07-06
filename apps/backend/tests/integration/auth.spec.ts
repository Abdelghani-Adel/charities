import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AuthModule } from "../../src/auth/auth.module";
import { JwtModule } from "@nestjs/jwt";

describe("Auth (Integration)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        JwtModule.register({ secret: "test-secret", signOptions: { expiresIn: "1h" } }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix("api/v1");
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("POST /api/v1/auth/login with valid credentials returns token", () => {
    return request(app.getHttpServer())
      .post("/api/v1/auth/login")
      .send({ email: "admin@charity.com", password: "password" })
      .expect(201)
      .expect((res) => {
        expect(res.body.status).toBe("success");
        expect(res.body.data.accessToken).toBeDefined();
      });
  });

  it("POST /api/v1/auth/login with invalid credentials returns 401", () => {
    return request(app.getHttpServer())
      .post("/api/v1/auth/login")
      .send({ email: "wrong@charity.com", password: "wrong" })
      .expect(401);
  });
});
