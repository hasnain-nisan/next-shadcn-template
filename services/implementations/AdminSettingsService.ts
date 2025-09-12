import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { IAdminSettingsService } from "../interfaces/IAdminSettingsService";
import { AdminSettings } from "@/types/adminSettings.types";
import { IAdminSettingsRepository } from "@/repositories/interfaces/IAdminSettingsRepository";

export class AdminSettingsService implements IAdminSettingsService {
  private readonly adminSettingsRepository: IAdminSettingsRepository;

  constructor() {
    this.adminSettingsRepository =
      RepositoryFactory.getAdminSettingsRepository();
  }

  async getSingle(): Promise<AdminSettings> {
    try {
      return await this.adminSettingsRepository.getSingle();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(
    id: string,
    data: Partial<AdminSettings>
  ): Promise<AdminSettings> {
    try {
      return await this.adminSettingsRepository.update(id, data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error("An unexpected error occurred");
  }
}
