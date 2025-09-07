import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { RoleManagerService } from "../services/role-manager.service";
import {
  RoleManager,
  RoleManagerDocument,
} from "../schemas/role-manager.schema";
import { CreateRoleDto } from "../dto/create-role.dto";

describe("RoleManagerService", () => {
  let service: RoleManagerService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let roleModel: Model<RoleManagerDocument>;

  const mockRole = {
    _id: "1",
    name: "test-role",
    description: "Test role description",
    isDefault: false,
    inheritedRoles: [],
    permissions: [],
    isActive: true,
    createdBy: "test-user-id",
    updatedBy: "test-user-id",
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRoleModel = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    updateMany: jest.fn(),
    countDocuments: jest.fn(),
    deleteOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleManagerService,
        {
          provide: getModelToken(RoleManager.name),
          useValue: mockRoleModel,
        },
      ],
    }).compile();

    service = module.get<RoleManagerService>(RoleManagerService);
    roleModel = module.get<Model<RoleManagerDocument>>(
      getModelToken(RoleManager.name)
    );

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a new role", async () => {
      const createRoleDto: CreateRoleDto = {
        name: "test-role",
        description: "Test role description",
        isDefault: false,
        inheritedRoles: [],
        permissions: [],
        isActive: true,
      };

      const userId = "test-user-id";

      mockRoleModel.findOne.mockResolvedValueOnce(null);
      mockRoleModel.create.mockResolvedValueOnce(mockRole);

      const result = await service.create(createRoleDto, userId);

      expect(mockRoleModel.findOne).toHaveBeenCalledWith({
        name: createRoleDto.name,
      });
      expect(mockRoleModel.create).toHaveBeenCalledWith({
        ...createRoleDto,
        createdBy: expect.any(Object),
        updatedBy: expect.any(Object),
      });
      expect(result).toEqual(mockRole);
    });

    it("should throw an error if role with same name exists", async () => {
      const createRoleDto: CreateRoleDto = {
        name: "existing-role",
        description: "Test role description",
        isDefault: false,
      };

      mockRoleModel.findOne.mockResolvedValueOnce(mockRole);

      await expect(
        service.create(createRoleDto, "test-user-id")
      ).rejects.toThrow(
        `Role with name '${createRoleDto.name}' already exists`
      );
    });
  });

  describe("findAll", () => {
    it("should return all roles with pagination", async () => {
      const page = 1;
      const limit = 10;
      const mockRoles = [mockRole];
      const total = 1;

      mockRoleModel.find.mockReturnValueOnce({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValueOnce(mockRoles),
      });

      mockRoleModel.countDocuments.mockResolvedValueOnce(total);

      const result = await service.findAll(page, limit);

      expect(mockRoleModel.find).toHaveBeenCalled();
      expect(mockRoleModel.countDocuments).toHaveBeenCalled();
      expect(result).toEqual({
        data: mockRoles,
        total,
      });
    });
  });

  describe("findOne", () => {
    it("should return a role by id", async () => {
      const roleId = "1";

      mockRoleModel.findById.mockResolvedValueOnce(mockRole);

      const result = await service.findOne(roleId);

      expect(mockRoleModel.findById).toHaveBeenCalledWith(roleId);
      expect(result).toEqual(mockRole);
    });

    it("should throw an error if role not found", async () => {
      const roleId = "non-existent-id";

      mockRoleModel.findById.mockResolvedValueOnce(null);

      await expect(service.findOne(roleId)).rejects.toThrow(
        `Role with ID '${roleId}' not found`
      );
    });
  });

  describe("update", () => {
    it("should update a role", async () => {
      const roleId = "1";
      const updateRoleDto = {
        name: "updated-role",
        description: "Updated description",
      };
      const userId = "test-user-id";

      mockRoleModel.findById.mockResolvedValueOnce(mockRole);
      mockRoleModel.findByIdAndUpdate.mockResolvedValueOnce({
        ...mockRole,
        ...updateRoleDto,
      });

      const result = await service.update(roleId, updateRoleDto, userId);

      expect(mockRoleModel.findById).toHaveBeenCalledWith(roleId);
      expect(mockRoleModel.findByIdAndUpdate).toHaveBeenCalledWith(
        roleId,
        {
          ...updateRoleDto,
          updatedBy: expect.any(Object),
          updatedAt: expect.any(Date),
        },
        { new: true }
      );
      expect(result).toEqual({
        ...mockRole,
        ...updateRoleDto,
      });
    });
  });

  describe("remove", () => {
    it("should delete a role", async () => {
      const roleId = "1";

      mockRoleModel.findById.mockResolvedValueOnce(mockRole);
      mockRoleModel.countDocuments.mockResolvedValueOnce(0);
      mockRoleModel.deleteOne.mockResolvedValueOnce({ deletedCount: 1 });

      await service.remove(roleId);

      expect(mockRoleModel.findById).toHaveBeenCalledWith(roleId);
      expect(mockRoleModel.countDocuments).toHaveBeenCalledWith({
        "roles.role": roleId,
      });
      expect(mockRoleModel.deleteOne).toHaveBeenCalledWith({ _id: roleId });
    });

    it("should throw an error if trying to delete default role", async () => {
      const defaultRole = { ...mockRole, isDefault: true };

      mockRoleModel.findById.mockResolvedValueOnce(defaultRole);

      await expect(service.remove("1")).rejects.toThrow(
        "Cannot delete default role"
      );
    });
  });
});
