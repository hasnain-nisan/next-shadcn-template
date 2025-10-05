
export interface IBulkUploadRepository {

  UploadExcel(file: File, uploadType: string, projectId?: string, clientId?: string): Promise<void>;
}
