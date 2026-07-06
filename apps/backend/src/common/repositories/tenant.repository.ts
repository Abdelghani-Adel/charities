import { PrismaService } from "../../prisma/prisma.service";

export abstract class TenantRepository {
  constructor(protected prisma: PrismaService) {}

  protected get tenantField(): string {
    return "charityId";
  }

  protected async findMany<T>(
    model: any,
    tenantId: string,
    args: any = {},
  ): Promise<T[]> {
    return model.findMany({
      where: { ...args.where, [this.tenantField]: tenantId },
      ...args,
    });
  }

  protected async findOne<T>(
    model: any,
    id: string,
    tenantId: string,
  ): Promise<T | null> {
    return model.findFirst({
      where: { id, [this.tenantField]: tenantId },
    });
  }

  protected async create<T>(model: any, tenantId: string, data: any): Promise<T> {
    return model.create({
      data: { ...data, [this.tenantField]: tenantId },
    });
  }
}
