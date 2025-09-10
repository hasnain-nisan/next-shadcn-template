"use client";

import * as React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { IconLoader2 } from "@tabler/icons-react";
import { ServiceFactory } from "@/services/ServiceFactory";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Project } from "@/types/project.types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ProjectDetailsPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = React.use(params);

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectService = ServiceFactory.getProjectService();
        const data = (await projectService.getById(id)) as unknown as {
          data: Project;
        };
        setProject(data as unknown as Project);
      } catch (err) {
        setError("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  return (
    <>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground px-4 lg:px-6">
        <Link href="/dashboard" className="hover:text-foreground font-medium">
          Dashboard
        </Link>
        <Separator orientation="vertical" className="h-4" />
        <Link
          href="/dashboard/projects"
          className="hover:text-foreground font-medium"
        >
          Projects
        </Link>
        <Separator orientation="vertical" className="h-4" />
        <span className="text-foreground font-semibold">Details</span>
      </div>

      {/* Header */}
      <div className="px-4 lg:px-6 mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">
          Project Details
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Explore project information, client details, stakeholders, and
          interviews.
        </p>
      </div>

      {/* Content */}
      <div className="px-4 lg:px-6 space-y-6">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <IconLoader2 className="animate-spin text-muted-foreground h-5 w-5" />
            <span className="ml-2 text-sm text-muted-foreground">
              Loading project details...
            </span>
          </div>
        ) : error ? (
          <div className="text-center text-sm text-red-500 py-10">{error}</div>
        ) : project ? (
          <>
            {/* Project Info Section */}
            <Card>
              <CardContent>
                <Accordion
                  type="single"
                  collapsible
                  className="text-sm text-muted-foreground"
                >
                  <AccordionItem value="project">
                    <AccordionTrigger className="text-base font-semibold text-foreground">
                      Project Details
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      {/* Project Info Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-4">
                        {/* Left Column */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              Name:
                            </span>
                            <p className="text-black">{project.name}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              Client Team:
                            </span>
                            <Badge variant="outline" className="px-3 py-1">
                              {project.clientTeam}
                            </Badge>
                          </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              Status:
                            </span>
                            <Badge
                              className={`px-3 py-1 ${
                                project.isDeleted
                                  ? "bg-red-600 text-white"
                                  : "bg-green-600 text-white"
                              }`}
                            >
                              {project.isDeleted ? "Deleted" : "Active"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              Project ID:
                            </span>
                            <Badge
                              variant="outline"
                              className="px-3 py-1 font-mono text-xs"
                            >
                              {project.id}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Client Info Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-foreground">
                            Client Name:
                          </span>
                          <Badge variant="outline" className="px-3 py-1">
                            {project.client.name}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-foreground">
                            Client Code:
                          </span>
                          <Badge
                            variant="outline"
                            className="px-3 py-1 font-mono"
                          >
                            {project.client.clientCode}
                          </Badge>
                        </div>
                      </div>

                      {/* Audit Info Row */}
                      <div className="pt-6 border-t space-y-4">
                        <h3 className="font-semibold text-foreground">
                          Audit Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <span className="font-medium text-foreground">
                              Created By:
                            </span>
                            <p className="text-black">
                              {project.createdBy?.email}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(project.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-foreground">
                              Updated By:
                            </span>
                            <p className="text-black">
                              {project.updatedBy?.email}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(project.updatedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Stakeholders Section */}
            <Card>
              <CardContent>
                <Accordion
                  type="single"
                  collapsible
                  className="text-sm text-muted-foreground"
                >
                  <AccordionItem value="stakeholders">
                    <AccordionTrigger className="text-base font-semibold text-foreground">
                      Stakeholders ({project.stakeholders?.length || 0})
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      {!project.stakeholders ||
                      project.stakeholders.length === 0 ? (
                        <div className="text-muted-foreground italic">
                          No stakeholders assigned to this project yet.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {project.stakeholders.map((stakeholder, index) => (
                            <div
                              key={stakeholder.id}
                              className="space-y-3 p-4 border rounded-lg"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">
                                  Name:
                                </span>
                                <p className="text-black capitalize">
                                  {stakeholder.name}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">
                                  Email:
                                </span>
                                <Badge variant="outline" className="px-3 py-1">
                                  {stakeholder.email}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">
                                  Phone:
                                </span>
                                <Badge variant="outline" className="px-3 py-1">
                                  {stakeholder.phone}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">
                                  Status:
                                </span>
                                <Badge
                                  className={`px-3 py-1 ${
                                    stakeholder.isDeleted
                                      ? "bg-red-600 text-white"
                                      : "bg-green-600 text-white"
                                  }`}
                                >
                                  {stakeholder.isDeleted
                                    ? "Inactive"
                                    : "Active"}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Interviews Section */}
            <Card>
              <CardContent>
                <Accordion
                  type="single"
                  collapsible
                  className="text-sm text-muted-foreground"
                >
                  <AccordionItem value="interviews">
                    <AccordionTrigger className="text-base font-semibold text-foreground">
                      Interviews ({project.interviews?.length || 0})
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      {!project.interviews ||
                      project.interviews.length === 0 ? (
                        <div className="text-muted-foreground italic">
                          No interviews scheduled for this project yet.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-6">
                          {project.interviews.map((interview, index) => (
                            <div
                              key={index}
                              className="space-y-3 p-4 border rounded-lg"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">
                                  Interview #{index + 1}
                                </span>
                              </div>
                              {/* Add more interview fields based on your interview type structure */}
                            </div>
                          ))}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="text-center text-sm text-muted-foreground py-10">
            No project data found.
          </div>
        )}
      </div>
    </>
  );
}
