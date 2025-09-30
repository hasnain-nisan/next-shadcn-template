"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ServiceFactory } from "@/services/ServiceFactory"
import {
    CheckCircle2,
    Loader2,
    Upload
} from "lucide-react"
import { useEffect, useState } from "react"

interface Client {
    id: string
    name: string
}

interface Project {
    id: string
    name: string
}

export default function BulkUploadPage() {
    const [uploadType, setUploadType] = useState<string>("")
    const [selectedClient, setSelectedClient] = useState<string>("")
    const [selectedProject, setSelectedProject] = useState<string>("")
    const [showSuccess, setShowSuccess] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const [clients, setClients] = useState<Client[]>([])
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoadingClients, setIsLoadingClients] = useState(false)
    const [isLoadingProjects, setIsLoadingProjects] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (uploadType === "project-stakeholder") {
            fetchClients()
        }
    }, [uploadType])

    useEffect(() => {
        if (uploadType === "stakeholder") {
            fetchProjects()
        } else if (uploadType === "project-stakeholder" && selectedClient) {
            fetchProjects()
        }
    }, [uploadType, selectedClient])

    const fetchClients = async () => {
        setIsLoadingClients(true)
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

            setClients(result.items)
        } catch (error) {
            console.error("Error fetching clients:", error)
        } finally {
            setIsLoadingClients(false)
        }
    }

    const fetchProjects = async () => {
        setIsLoadingProjects(true)
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
            console.error("Error fetching projects:", error)
        } finally {
            setIsLoadingProjects(false)
        }
    }

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            console.log("File selected:", {
                name: file.name,
                size: file.size,
                type: file.type,
            })
            setSelectedFile(file)
        }
    }

    const handleBulkUpload = async () => {
        console.log("Starting bulk upload with values:", {
            uploadType,
            selectedClient,
            selectedProject,
            selectedFile: selectedFile ? { name: selectedFile.name, size: selectedFile.size } : null,
        })

        if (!selectedFile) {
            alert("Please select a file to upload")
            return
        }

        if (uploadType === "project-stakeholder" && !selectedClient) {
            alert("Please select a client")
            return
        }

        if (uploadType === "stakeholder" && !selectedProject) {
            alert("Please select a project")
            return
        }

        setIsSubmitting(true)

        try {
            const formData = new FormData()
            formData.append("uploadType", uploadType)
            formData.append("file", selectedFile)

            if (selectedClient) {
                formData.append("clientId", selectedClient)
            }
            if (selectedProject) {
                formData.append("projectId", selectedProject)
            }

            console.log("FormData being sent:")
            for (const [key, value] of formData.entries()) {
                if (value instanceof File) {
                    console.log(`  ${key}:`, { name: value.name, size: value.size, type: value.type })
                } else {
                    console.log(`  ${key}:`, value)
                }
            }

            const response = await fetch("/api/bulk-upload", {
                method: "POST",
                body: formData,
            })

            const result = await response.json()

            console.log("API response:", result)

            if (result.success) {
                setShowSuccess(true)
                setTimeout(() => {
                    setShowSuccess(false)
                    setSelectedFile(null)
                    setSelectedClient("")
                    setSelectedProject("")
                    setUploadType("")
                }, 3000)
            } else {
                alert(result.error || "Upload failed. Please try again.")
            }
        } catch (error) {
            console.error("Upload error:", error)
            alert("An error occurred during upload. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const shouldShowFileUpload = () => {
        if (uploadType === "client-project-stakeholder") return true
        if (uploadType === "project-stakeholder" && selectedClient) return true
        if (uploadType === "stakeholder" && selectedProject) return true
        return false
    }

    return (
        <div className="flex min-h-screen">
            {/* Main Content */}
            <main className="flex-1 p-8">
                <h1 className="mb-8 text-2xl font-semibold text-slate-800">Bulk Upload</h1>

                {showSuccess ? (
                    <div className="flex items-center gap-2 text-slate-700">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span className="text-sm">All data has been uploaded successfully</span>
                    </div>
                ) : (
                    <div className="max-w-md space-y-6">
                        {/* Upload Type Dropdown */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Choose type of upload</label>
                            <Select value={uploadType} onValueChange={setUploadType}>
                                <SelectTrigger className="w-full border-slate-300 bg-white">
                                    <SelectValue placeholder="Select upload type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="client-project-stakeholder">Upload client, project, stakeholder</SelectItem>
                                    <SelectItem value="project-stakeholder">Upload project, stakeholder</SelectItem>
                                    <SelectItem value="stakeholder">Upload stakeholder</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {uploadType === "project-stakeholder" && (
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Select client</label>
                                <Select value={selectedClient} onValueChange={setSelectedClient} disabled={isLoadingClients}>
                                    <SelectTrigger className="w-full border-slate-300 bg-white">
                                        <SelectValue placeholder={isLoadingClients ? "Loading clients..." : "Choose a client"} />
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
                                <label className="mb-2 block text-sm font-medium text-slate-700">Select project</label>
                                <Select value={selectedProject} onValueChange={setSelectedProject} disabled={isLoadingProjects}>
                                    <SelectTrigger className="w-full border-slate-300 bg-white">
                                        <SelectValue placeholder={isLoadingProjects ? "Loading projects..." : "Choose a project"} />
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
                                        disabled={isSubmitting}
                                    />
                                    <label htmlFor="file-upload">
                                        <div className="flex cursor-pointer items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 max-w-xs sm:max-w-sm">
                                            <Upload className="h-4 w-4 shrink-0" />
                                            <span className="break-all whitespace-normal text-left">
                                                {selectedFile ? selectedFile.name : "Upload CSV"}
                                            </span>
                                        </div>
                                    </label>
                                </div>

                                <div className="flex justify-start">
                                    <Button
                                        onClick={handleBulkUpload}
                                        disabled={isSubmitting}
                                        className="rounded-md bg-slate-700 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-600 disabled:opacity-50"
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
            </main>
        </div>
    )
}
