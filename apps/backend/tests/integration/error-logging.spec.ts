import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, Controller, Get, Module, NotFoundException, BadRequestException } from "@nestjs/common";
import request from "supertest";
import { GlobalExceptionFilter } from "../../src/common/filters/http-exception.filter";
import { CorrelationInterceptor } from "../../src/common/interceptors/correlation.interceptor";
import { ResponseInterceptor } from "../../src/common/interceptors/response.interceptor";

@Controller("test-errors")
class TestErrorController {
  @Get("not-found")
  notFound() {
    throw new NotFoundException("Resource not found");
  }

  @Get("bad-request")
  badRequest() {
    throw new BadRequestException("Invalid input");
  }
}

@Module({ controllers: [TestErrorController] })
class TestErrorModule {}

describe("Error and Logging (Integration)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestErrorModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix("api/v1");
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalInterceptors(new CorrelationInterceptor(), new ResponseInterceptor());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("returns standardized error response for 404", () => {
    return request(app.getHttpServer())
      .get("/api/v1/test-errors/not-found")
      .expect(404)
      .expect((res) => {
        expect(res.body.status).toBe("error");
        expect(res.body.code).toBe("NOT_FOUND");
        expect(res.body.correlationId).toBeDefined();
        expect(res.body.message).toBeDefined();
      });
  });

  it("returns standardized error response for 400", () => {
    return request(app.getHttpServer())
      .get("/api/v1/test-errors/bad-request")
      .expect(400)
      .expect((res) => {
        expect(res.body.status).toBe("error");
        expect(res.body.code).toBe("VALIDATION_ERROR");
        expect(res.body.correlationId).toBeDefined();
      });
  });
});
