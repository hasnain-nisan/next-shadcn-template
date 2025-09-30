import { IBulkUploadRepository } from "@/repositories/interfaces/IBulkUploadRepository";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { IBulkUploadService } from "../interfaces/IBulkUploadService";

export class BulkUploadService implements IBulkUploadService {
  private readonly bulkUploadRepository: IBulkUploadRepository;

  constructor() {
    this.bulkUploadRepository = RepositoryFactory.getBulkUploadRepository();
  }

  async uploadExcel(file: File, uploadType: string, projectId?: string, clientId?: string): Promise<void> {
    return this.bulkUploadRepository.UploadExcel(file, uploadType, projectId, clientId);
  }
}
