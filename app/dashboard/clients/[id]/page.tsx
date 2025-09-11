"use client";

import * as React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { IconLoader2 } from "@tabler/icons-react";
import { ServiceFactory } from "@/services/ServiceFactory";
import { Client } from "@/types/client.types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CreateInterviewModal } from "@/components/interview/CreateInterviewModal";
import { se } from "date-fns/locale";
import { set } from "zod";
import { useSession } from "next-auth/react";

export default function ClientDetailsPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = React.use(params);

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [projectId, setProjectId] = useState<string>("");

  const { data: session } = useSession();
  const accessScopes = session?.user?.accessScopes || {};
  const canCreateInterviews = accessScopes.canCreateInterviews ?? false;


  useEffect(() => {
    const fetchClient = async () => {
      try {
        const clientService = ServiceFactory.getClientService();
        const data = (await clientService.getClientById(id)) as unknown as {
          data: Client;
        };
        setClient(data as unknown as Client);
        setClients([data as unknown as Client]);
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
                              {client.createdBy?.email}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(client.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-foreground">
                              Updated By:
                            </span>
                            <p className="text-black">
                              {client.updatedBy?.email}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(client.updatedAt).toLocaleString()}
                            </p>
                          </div>
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
                      Stakeholders ({client.stakeholders?.length || 0})
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      {client.stakeholders?.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-3">
                          {client.stakeholders.map((s) => (
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
                      Projects ({client.projects?.length || 0})
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      {client.projects.length === 0 ? (
                        <div className="italic text-muted-foreground">
                          No projects assigned to this client yet.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                          {client.projects.map((project, index) => (
                            <div
                              key={index}
                              className="space-y-3 border p-4 rounded-md shadow-sm bg-white"
                            >
                              {/* Project Name */}
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">
                                  Project Name:
                                </span>
                                <p className="text-black">
                                  {project.name || "Unnamed Project"}
                                </p>
                              </div>

                              {/* Status */}
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">
                                  Status:
                                </span>
                                <Badge
                                  variant="outline"
                                  className={`px-3 py-1 ${
                                    project.isDeleted
                                      ? "border-red-500 text-red-600"
                                      : "border-green-500 text-green-600"
                                  }`}
                                >
                                  {project.isDeleted ? "Deleted" : "Active"}
                                </Badge>
                              </div>

                              {/* Action Button */}
                              <div className="pt-3">
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="w-full"
                                  onClick={() => {
                                    setProjectId(project.id)
                                    setOpenCreateModal(true)
                                  }
                                  }
                                  disabled={project.isDeleted || !canCreateInterviews}
                                >
                                  Request Interview
                                </Button>
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
                      Interviews ({client.interviews?.length || 0})
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      {client.interviews.length === 0 ? (
                        <div className="italic text-muted-foreground">
                          No interviews linked to this client yet.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                          {client.interviews.map((interview, index) => (
                            <div
                              key={index}
                              className="space-y-2 border p-4 rounded-md"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">
                                  Interview Title:
                                </span>
                                <p className="text-black">
                                  {interview.name || `Interview ${index + 1}`}
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

      <CreateInterviewModal
        open={openCreateModal}
        setOpen={setOpenCreateModal}
        setRefetch={setRefetch}
        clients={clients}
        id={client?.id}
        projectId={projectId}
      />
    </>
  );
}
