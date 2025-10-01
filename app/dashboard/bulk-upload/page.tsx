/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import type React from "react";
import Link from "next/link"; // Import Link for breadcrumbs

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator"; // Import Separator
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServiceFactory } from "@/services/ServiceFactory";
// Import IconX for the remove button
import { CheckCircle2, Loader2, Upload, X as IconX } from "lucide-react";
import { useEffect, useState } from "react";
// Assuming you are using sonner for toast
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
  const [isFormValid, setIsFormValid] = useState(false); // Re-adding isFormValid for proper button disabling

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

  /**
   * New function to clear the selected file.
   * Resets the selectedFile state to null.
   * Also clears the file input value so the same file can be selected again.
   */
  const handleRemoveFile = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent button from submitting a form
    setSelectedFile(null);

    // Explicitly clear the file input value
    const inputElement = document.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = "";
    }
  };

  /**
   * Resets all state variables to return the form to its initial state.
   */
  const handleResetForm = () => {
    // Reset primary selection states
    setUploadType("");
    setSelectedClient("");
    setSelectedProject("");
    setSelectedFile(null);
    setShowSuccess(false);

    // Explicitly clear the file input value
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
      //   const formData = new FormData();
      //   formData.append("uploadType", uploadType);
      //   formData.append("file", selectedFile);

      //   if (selectedClient) {
      //     formData.append("clientId", selectedClient);
      //   }
      //   if (selectedProject) {
      //     formData.append("projectId", selectedProject);
      //   }

      const service = ServiceFactory.getBulkUploadService();
      // Assuming a successful call here would eventually lead to setShowSuccess(true)
      await service.uploadExcel(
        selectedFile,
        uploadType,
        selectedProject,
        selectedClient
      );

      // Placeholder for success handling from API response
      setShowSuccess(true);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        (error as { message?: string })?.message || "An error occurred during upload. Please try again."
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
          href="/dashboard/bulk-upload" // Assuming this is the correct path
          className="text-foreground font-semibold"
        >
          Bulk Upload
        </Link>
      </div>

      {/* Module Header */}
      <div className="px-4 lg:px-6 mb-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Bulk Upload</h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Import client, project, and stakeholder data by uploading a formatted
          CSV or Excel file.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="px-4 lg:px-6">
        {showSuccess ? (
          // Success State
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
          // Upload Form
          <div className="max-w-md space-y-6">
            {/* Upload Type Dropdown */}
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

            {/* Select Client Dropdown */}
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

            {/* Select Project Dropdown */}
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

            {/* File Upload and Submit Button */}
            {shouldShowFileUpload() && (
              <div className="space-y-4">
                <div>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                    style={{ display: "none" }} // Hide the default file inputs
                    disabled={isSubmitting}
                  />

                  {/* Conditional Display for File Selection */}
                  {!selectedFile ? (
                    // 1. Show "Select File" button when no file is chosen
                    <label htmlFor="file-upload" className="w-full">
                      <div className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700">
                        <Upload className="h-4 w-4 shrink-0" />
                        <span className="break-all whitespace-normal text-left">
                          Select File
                        </span>
                      </div>
                    </label>
                  ) : (
                    // 2. Show selected file name and a remove button
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

                  {/* Muted text for allowed file types */}
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
