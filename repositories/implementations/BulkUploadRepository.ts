import { API_ENDPOINTS } from "@/lib/constants";
import { makeApiRequest } from "@/lib/makeApiRequest";
import { IBulkUploadRepository } from "../interfaces/IBulkUploadRepository";

export class BulkUploadRepository implements IBulkUploadRepository {
  constructor() {}

  async UploadExcel(
    file: File,
    uploadType: string,
    projectId?: string,
    clientId?: string
  ): Promise<void> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploadType", uploadType);
    if (projectId) formData.append("projectId", projectId);
    if (clientId) formData.append("clientId", clientId);

    const res = await makeApiRequest<void>(
      API_ENDPOINTS.bulkUpload.uploadExcel,
      {
        method: "POST",
        body: formData,
      }
    );

    return res;
  }
}
