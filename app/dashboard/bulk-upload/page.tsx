/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import type React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServiceFactory } from "@/services/ServiceFactory";
import {
  CheckCircle2,
  Download,
  Loader2,
  Upload,
  X as IconX,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Client {
  id: string;
  name: string;
}

interface Project {
  id: string;
  name: string;
}

export default function BulkUploadPage() {
  const [uploadType, setUploadType] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // ---State to trigger the download effect ---
  const [fileToDownload, setFileToDownload] = useState<string | null>(null);

  // --- Data Fetching Logic (Unchanged) ---

  useEffect(() => {
    if (uploadType === "project-stakeholder") {
      fetchClients();
    }
  }, [uploadType]);

  useEffect(() => {
    if (uploadType === "stakeholder") {
      fetchProjects();
    } else if (uploadType === "project-stakeholder" && selectedClient) {
      fetchProjects();
    }
  }, [uploadType, selectedClient]);

  // Logic to handle form validation state
  useEffect(() => {
    let valid = false;
    if (uploadType === "client-project-stakeholder" && selectedFile) {
      valid = true;
    } else if (
      uploadType === "project-stakeholder" &&
      selectedClient &&
      selectedFile
    ) {
      valid = true;
    } else if (
      uploadType === "stakeholder" &&
      selectedProject &&
      selectedFile
    ) {
      valid = true;
    }
    setIsFormValid(valid);
  }, [uploadType, selectedClient, selectedProject, selectedFile]);

  useEffect(() => {
      if (!fileToDownload) return;

      const downloadFile = async () => {
        setIsDownloading(true);
        try {
          const link = document.createElement("a");
          link.href = `/samples/${fileToDownload}`;
          link.download = fileToDownload;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.info(`Downloading ${fileToDownload}...`);
        } catch (error) {
          console.error("Download error:", error);
          toast.error("Download failed. Please try again.");
        } finally {
          setIsDownloading(false);
          setFileToDownload(null);
        }
      };

      downloadFile();
    }, [fileToDownload]);


  const fetchClients = async () => {
    setIsLoadingClients(true);
    try {
      const clientService = ServiceFactory.getClientService();
      const result = await clientService.getAllClients({
        page: 1,
        limit: Number.MAX_SAFE_INTEGER,
        sortField: undefined,
        sortOrder: undefined,
        name: undefined,
        clientCode: undefined,
        deletedStatus: "false",
      });
      setClients(result.items);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setIsLoadingClients(false);
    }
  };

  const fetchProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const projectService = ServiceFactory.getProjectService();
      const result = await projectService.getAll({
        page: 1,
        limit: Number.MAX_SAFE_INTEGER,
        sortField: undefined,
        sortOrder: undefined,
        name: undefined,
        deletedStatus: "false",
      });
      setProjects(result.items);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setSelectedFile(null);
    const inputElement = document.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = "";
    }
  };

  const handleResetForm = () => {
    setUploadType("");
    setSelectedClient("");
    setSelectedProject("");
    setSelectedFile(null);
    setShowSuccess(false);
    const inputElement = document.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = "";
    }
  };

  const handleBulkUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }
    if (uploadType === "project-stakeholder" && !selectedClient) {
      toast.error("Please select a client");
      return;
    }
    if (uploadType === "stakeholder" && !selectedProject) {
      toast.error("Please select a project");
      return;
    }
    setIsSubmitting(true);
    try {
      const service = ServiceFactory.getBulkUploadService();
      await service.uploadExcel(
        selectedFile,
        uploadType,
        selectedProject,
        selectedClient
      );
      setShowSuccess(true);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        (error as { message?: string })?.message ||
          "An error occurred during upload. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const shouldShowFileUpload = () => {
    if (uploadType === "client-project-stakeholder") return true;
    if (uploadType === "project-stakeholder" && selectedClient) return true;
    if (uploadType === "stakeholder" && selectedProject) return true;
    return false;
  };

  // --- JSX Layout ---

  return (
    <>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground px-4 lg:px-6">
        <Link href="/dashboard" className="hover:text-foreground font-medium">
          Dashboard
        </Link>
        <Separator orientation="vertical" className="h-4" />
        <Link
          href="/dashboard/bulk-upload"
          className="text-foreground font-semibold"
        >
          Bulk Upload
        </Link>
      </div>

      {/* Module Header */}
      <div className="px-4 lg:px-6 mb-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Bulk Upload</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                disabled={isDownloading}
                className="w-[220px] justify-center"
              >
                {isDownloading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Bulk Download Samples
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[350px]">
              {[
                {
                  label: "Download client, project, and stakeholder data",
                  filename: "tp-client-project-stakeholder.xlsx",
                },
                {
                  label: "Download project and stakeholder data",
                  filename: "tp-project-stakeholder.xlsx",
                },
                {
                  label: "Download stakeholder data",
                  filename: "tp-stakeholder.xlsx",
                },
              ].map(({ label, filename }) => (
                <DropdownMenuItem
                  key={filename}
                  onSelect={() => setFileToDownload(filename)}
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Import client, project, and stakeholder data by uploading a formatted
          CSV or Excel file.
        </p>
      </div>

      {/* Main Content Area (Unchanged) */}
      <div className="px-4 lg:px-6">
        {showSuccess ? (
          <div className="flex flex-col items-start gap-4 text-slate-700">
            <div className="flex items-center gap-2 text-slate-700">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-sm">
                All data has been uploaded successfully
              </span>
            </div>
            <Button
              onClick={handleResetForm}
              variant="outline"
              className="mt-2"
            >
              Upload Another File
            </Button>
          </div>
        ) : (
          <div className="max-w-md space-y-6">
            {/* ... rest of your unchanged form JSX ... */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Choose type of upload
              </label>
              <Select value={uploadType} onValueChange={setUploadType}>
                <SelectTrigger className="w-full border-slate-300 bg-white">
                  <SelectValue placeholder="Select upload type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client-project-stakeholder">
                    Upload client, project, stakeholder
                  </SelectItem>
                  <SelectItem value="project-stakeholder">
                    Upload project, stakeholder
                  </SelectItem>
                  <SelectItem value="stakeholder">
                    Upload stakeholder
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {uploadType === "project-stakeholder" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Select client
                </label>
                <Select
                  value={selectedClient}
                  onValueChange={setSelectedClient}
                  disabled={isLoadingClients}
                >
                  <SelectTrigger className="w-full border-slate-300 bg-white">
                    <SelectValue
                      placeholder={
                        isLoadingClients
                          ? "Loading clients..."
                          : "Choose a client"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {uploadType === "stakeholder" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Select project
                </label>
                <Select
                  value={selectedProject}
                  onValueChange={setSelectedProject}
                  disabled={isLoadingProjects}
                >
                  <SelectTrigger className="w-full border-slate-300 bg-white">
                    <SelectValue
                      placeholder={
                        isLoadingProjects
                          ? "Loading projects..."
                          : "Choose a project"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {shouldShowFileUpload() && (
              <div className="space-y-4">
                <div>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                    style={{ display: "none" }}
                    disabled={isSubmitting}
                  />
                  {!selectedFile ? (
                    <label htmlFor="file-upload" className="w-full">
                      <div className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700">
                        <Upload className="h-4 w-4 shrink-0" />
                        <span className="break-all whitespace-normal text-left">
                          Select File
                        </span>
                      </div>
                    </label>
                  ) : (
                    <div className="flex w-full items-center justify-between gap-2 rounded-md border border-slate-300 bg-white p-3 shadow-sm">
                      <span className="text-sm font-medium text-slate-700 truncate">
                        {selectedFile.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRemoveFile}
                        className="h-6 w-6 shrink-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                        disabled={isSubmitting}
                      >
                        <IconX className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    Allowed file types: **.csv, .xlsx, .xls**
                  </p>
                </div>
                <div className="flex justify-start">
                  <Button
                    onClick={handleBulkUpload}
                    disabled={isSubmitting || !isFormValid}
                    className="w-full rounded-md bg-slate-700 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-600 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Bulk Upload"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}