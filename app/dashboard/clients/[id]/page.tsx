/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import * as React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { IconLoader2 } from "@tabler/icons-react";
import { ServiceFactory } from "@/services/ServiceFactory";
import { Client } from "@/types/client.types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ClientDetailsPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = React.use(params);

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const clientService = ServiceFactory.getClientService();
        const data = (await clientService.getClientById(id)) as unknown as {
          data: Client;
        };
        setClient(data as unknown as Client);
      } catch (err) {
        setError("Failed to load client details.");
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
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
          href="/dashboard/clients"
          className="hover:text-foreground font-medium"
        >
          Clients
        </Link>
        <Separator orientation="vertical" className="h-4" />
        <span className="text-foreground font-semibold">Details</span>
      </div>

      {/* Header */}
      <div className="px-4 lg:px-6 mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">
          Client Details
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          View client profile, creator info, and engagement metadata.
        </p>
      </div>

      {/* Content */}
      <div className="px-4 lg:px-6 space-y-6">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <IconLoader2 className="animate-spin text-muted-foreground h-5 w-5" />
            <span className="ml-2 text-sm text-muted-foreground">
              Loading client details...
            </span>
          </div>
        ) : error ? (
          <div className="text-center text-sm text-red-500 py-10">{error}</div>
        ) : client ? (
          <>
            {/* Info Section */}
            <Card>
              <CardContent>
                <Accordion
                  type="single"
                  collapsible
                  className="text-sm text-muted-foreground"
                >
                  <AccordionItem value="client">
                    <AccordionTrigger className="text-base font-semibold text-foreground">
                      Client Info
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      {/* Row 1: Name, Code, Status */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            Name:
                          </span>
                          <p className="text-black">{client.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            Code:
                          </span>
                          <Badge variant="outline" className="px-3 py-1">
                            {client.clientCode}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            Status:
                          </span>
                          <Badge
                            className={`px-3 py-1 ${
                              client.isDeleted
                                ? "bg-red-600 text-white"
                                : "bg-green-600 text-white"
                            }`}
                          >
                            {client.isDeleted ? "Deleted" : "Active"}
                          </Badge>
                        </div>
                      </div>

                      {/* Row 2: CreatedBy & UpdatedBy */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                          <span className="font-medium text-foreground">
                            Created By:
                          </span>
                          <p className="mt-1 text-black">
                            {client.createdBy?.email || "—"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(client.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-foreground">
                            Updated By:
                          </span>
                          <p className="mt-1 text-black">
                            {client.updatedBy?.email || "—"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(client.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Stakeholders section */}
            <Card>
              <CardContent>
                <Accordion
                  type="single"
                  collapsible
                  className="text-sm text-muted-foreground"
                >
                  <AccordionItem value="stakeholders">
                    <AccordionTrigger className="text-base font-semibold text-foreground">
                      Stakeholders
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      {client.stakeholders?.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-3">
                          {client.stakeholders.map((s: any) => (
                            <Badge
                              key={s.id}
                              variant="outline"
                              className="px-3 py-1"
                            >
                              {s.name}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="italic text-muted-foreground">
                          No stakeholders assigned
                        </p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Projects Section */}
            <Card>
              <CardContent>
                <Accordion
                  type="single"
                  collapsible
                  className="text-sm text-muted-foreground"
                >
                  <AccordionItem value="projects">
                    <AccordionTrigger className="text-base font-semibold text-foreground">
                      Projects
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      {client.projects.length === 0 ? (
                        <div className="italic text-muted-foreground">
                          No projects assigned to this client yet.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                          {client.projects.map((project, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">
                                  Project Name:
                                </span>
                                <p className="text-black">
                                  {project.name || "Unnamed Project"}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">
                                  Status:
                                </span>
                                <Badge variant="outline" className="px-3 py-1">
                                  {project.status || "Unknown"}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">
                                  Deadline:
                                </span>
                                <p className="text-black">
                                  {project.deadline
                                    ? new Date(
                                        project.deadline
                                      ).toLocaleDateString()
                                    : "—"}
                                </p>
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
                      Interviews
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      {client.interviews.length === 0 ? (
                        <div className="italic text-muted-foreground">
                          No interviews linked to this client yet.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                          {client.interviews.map((interview, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">
                                  Interview Title:
                                </span>
                                <p className="text-black">
                                  {interview.title || `Interview ${index + 1}`}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">
                                  Date:
                                </span>
                                <p className="text-black">
                                  {interview.date
                                    ? new Date(
                                        interview.date
                                      ).toLocaleDateString()
                                    : "—"}
                                </p>
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
            No client data found.
          </div>
        )}
      </div>
    </>
  );
}
