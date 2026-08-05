import type { IClinicRepository } from "../../interfaces/IClinicRepository";
import type { IUserRepository } from "../../interfaces/IUserRepository";
import type { IRoleRepository } from "../../interfaces/IRoleRepository";
import type { IRoleAssignmentRepository } from "../../interfaces/IRoleAssignmentRepository";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { IEventPublisher } from "../../interfaces/IEventPublisher";

import { Result } from "../../common/ApplicationResult";
import { ConflictErrorFactory } from "../../errors/ConflictError";
import { NotFoundErrorFactory } from "../../errors/NotFoundError";
import { RoleCode } from "@/lib/platform/domain/identity";

import type { RegisterUserRequest } from "./RegisterUserRequest";
import type { RegisterUserResponse } from "./RegisterUserResponse";

export class RegisterUserUseCase {
  constructor(
    private readonly clinicRepository: IClinicRepository,
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository,
    private readonly roleAssignmentRepository: IRoleAssignmentRepository,
    private readonly unitOfWork: IUnitOfWork,
    private readonly eventPublisher: IEventPublisher,
  ) {}

  async execute(
    request: RegisterUserRequest,
  ) {
    const clinic =
      await this.clinicRepository.findById(
        request.clinicId,
      );

    if (!clinic) {
      throw NotFoundErrorFactory.create(
        "Clinic",
        request.clinicId,
      );
    }

    if (
      await this.userRepository.existsByEmail(
        request.email,
      )
    ) {
      throw ConflictErrorFactory.duplicate(
        "User",
        request.email,
      );
    }

    const role =
      await this.roleRepository.findByCode(
        RoleCode.create(request.roleCode),
      );

    if (!role) {
      throw NotFoundErrorFactory.create(
        "Role",
        request.roleCode,
      );
    }

    const response =
      await this.unitOfWork.execute(async () => {
        const user =
          await this.userRepository.create({
            clinicId: request.clinicId,
            fullName: request.fullName,
            email: request.email,
            password: request.password,
            phone: request.phone,
          });

        await this.roleAssignmentRepository.assign({
          userId: user.id,
          tenantId: user.tenantId,
          clinicId: request.clinicId,
          roleId: role.id,
        });

        // Placeholder for future invitation workflow
        const invitationSent =
          request.sendInvitation ?? false;

        await this.eventPublisher.publish({
  id: crypto.randomUUID(),
  type: "UserRegistered",
  occurredAt: new Date(),
  clinicId: request.clinicId,
  payload: {
    userId: user.id,
    clinicId: request.clinicId,
    roleCode: request.roleCode,
  },
});
        return Result.success<RegisterUserResponse>({
          userId: user.id,
          clinicId: request.clinicId,
          roleCode: request.roleCode,
          invitationSent,
          success: true,
        });
      });

    return response;
  }
}
