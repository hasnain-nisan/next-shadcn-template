"use client";

import * as React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { IconLoader2 } from "@tabler/icons-react";
import { ServiceFactory } from "@/services/ServiceFactory";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import type { Interview } from "@/types/interview.types";

export default function InterviewDetailsPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = React.use(params);

  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const interviewService = ServiceFactory.getInterviewService();
        const data = (await interviewService.getById(id)) as unknown as {
          data: Interview;
        };
        setInterview(data as unknown as Interview);
      } catch (err) {
        setError("Failed to load interview details.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
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
          href="/dashboard/interviews"
          className="hover:text-foreground font-medium"
        >
          Interviews
        </Link>
        <Separator orientation="vertical" className="h-4" />
        <span className="text-foreground font-semibold">Details</span>
      </div>

      {/* Header */}
      <div className="px-4 lg:px-6 mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">
          Interview Details
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Explore interview information, client, project, and audit logs.
        </p>
      </div>

      {/* Content */}
      <div className="px-4 lg:px-6 space-y-6">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <IconLoader2 className="animate-spin text-muted-foreground h-5 w-5" />
            <span className="ml-2 text-sm text-muted-foreground">
              Loading interview details...
            </span>
          </div>
        ) : error ? (
          <div className="text-center text-sm text-red-500 py-10">{error}</div>
        ) : interview ? (
          <>
            {/* Interview Info Section */}
            <Card>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="interview">
                    <AccordionTrigger className="text-base font-semibold text-foreground">
                      Interview Information
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div>
                            <span className="font-medium text-foreground">
                              Name:
                            </span>
                            <p className="text-black">{interview.name}</p>
                          </div>
                          <div>
                            <span className="font-medium text-foreground">
                              Date:
                            </span>
                            <p className="text-black">
                              {new Date(interview.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <span className="font-medium text-foreground">
                              Status:
                            </span>
                            <Badge
                              className={`px-3 py-1 ${
                                interview.isDeleted
                                  ? "bg-red-600 text-white"
                                  : "bg-green-600 text-white"
                              }`}
                            >
                              {interview.isDeleted ? "Inactive" : "Active"}
                            </Badge>
                          </div>
                          <div>
                            <span className="font-medium text-foreground">
                              Interview ID:
                            </span>
                            <Badge
                              variant="outline"
                              className="px-3 py-1 font-mono text-xs"
                            >
                              {interview.id}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Links */}
                      <div className="space-y-2">
                        {interview.gDriveId && (
                          <div>
                            <span className="font-medium text-foreground">
                              Google Drive:
                            </span>{" "}
                            <a
                              href={interview.gDriveId}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              View Document
                            </a>
                          </div>
                        )}
                        {interview.requestDistillation && (
                          <div>
                            <span className="font-medium text-foreground">
                              Request Distillation:
                            </span>{" "}
                            <a
                              href={interview.requestDistillation}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              Open Link
                            </a>
                          </div>
                        )}
                        {interview.requestCoaching && (
                          <div>
                            <span className="font-medium text-foreground">
                              Request Coaching:
                            </span>{" "}
                            <a
                              href={interview.requestCoaching}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              Open Link
                            </a>
                          </div>
                        )}
                        {interview.requestUserStories && (
                          <div>
                            <span className="font-medium text-foreground">
                              Request User Stories:
                            </span>{" "}
                            <a
                              href={interview.requestUserStories}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              Open Link
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Audit Info (moved here) */}
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
                              {interview.createdBy?.email}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(interview.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-foreground">
                              Updated By:
                            </span>
                            <p className="text-black">
                              {interview.updatedBy?.email}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(interview.updatedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Client Section */}
            <Card>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="client">
                    <AccordionTrigger className="text-base font-semibold text-foreground">
                      Client Information
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium text-foreground">
                            Client Name:
                          </span>{" "}
                          <Badge variant="outline">
                            {interview.client.name}
                          </Badge>
                        </div>
                        <div>
                          <span className="font-medium text-foreground">
                            Client Code:
                          </span>{" "}
                          <Badge variant="outline" className="font-mono">
                            {interview.client.clientCode}
                          </Badge>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Project Section */}
            <Card>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="project">
                    <AccordionTrigger className="text-base font-semibold text-foreground">
                      Project Information
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-4">
                      <div>
                        <span className="font-medium text-foreground">
                          Project Name:
                        </span>{" "}
                        <Badge variant="outline">
                          {interview.project.name}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">
                          Client Team:
                        </span>{" "}
                        <Badge variant="outline">
                          {interview.project.clientTeam}
                        </Badge>
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
                      Stakeholders ({interview.stakeholders?.length || 0})
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      {!interview.stakeholders ||
                      interview.stakeholders.length === 0 ? (
                        <div className="text-muted-foreground italic">
                          No stakeholders assigned to this interview yet.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {interview.stakeholders.map((stakeholder, index) => (
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
          </>
        ) : (
          <div className="text-center text-sm text-muted-foreground py-10">
            No interview data found.
          </div>
        )}
      </div>
    </>
  );
}
