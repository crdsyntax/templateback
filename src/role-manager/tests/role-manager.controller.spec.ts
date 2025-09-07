import { Test, TestingModule } from "@nestjs/testing";
import { RoleManagerController } from "./role-manager.controller";

describe("RoleManagerController", () => {
  let controller: RoleManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleManagerController],
    }).compile();

    controller = module.get<RoleManagerController>(RoleManagerController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
