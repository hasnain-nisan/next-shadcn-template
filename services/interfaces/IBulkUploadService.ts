
export interface IBulkUploadService {
  uploadExcel(file: File, uploadType: string, projectId?: string, clientId?: string): Promise<void>;
}
