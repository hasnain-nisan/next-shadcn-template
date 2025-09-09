"use client";

import * as React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { IconLoader2 } from "@tabler/icons-react";
import { ServiceFactory } from "@/services/ServiceFactory";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ClientStakeholder } from "@/types/stakeholder.types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ClientStakeholderDetailsPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = React.use(params);

  const [clientStakeholder, setClientStakeholder] =
    useState<ClientStakeholder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const clientStakeholderService =
          ServiceFactory.getClientStakeholderService();
        const data = (await clientStakeholderService.getById(
          id
        )) as unknown as {
          data: ClientStakeholder;
        };
        setClientStakeholder(data as unknown as ClientStakeholder);
      } catch (err) {
        setError("Failed to load client stakeholder details.");
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
          href="/dashboard/client-stakeholders"
          className="hover:text-foreground font-medium"
        >
          Client Stakeholders
        </Link>
        <Separator orientation="vertical" className="h-4" />
        <span className="text-foreground font-semibold">Details</span>
      </div>

      {/* Header */}
      <div className="px-4 lg:px-6 mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">
          Client Stakeholder Details
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Explore stakeholder identity, associated client, and activity
          insights.
        </p>
      </div>

      {/* Content */}
      <div className="px-4 lg:px-6 space-y-6">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <IconLoader2 className="animate-spin text-muted-foreground h-5 w-5" />
            <span className="ml-2 text-sm text-muted-foreground">
              Loading client stakeholder details...
            </span>
          </div>
        ) : error ? (
          <div className="text-center text-sm text-red-500 py-10">{error}</div>
        ) : clientStakeholder ? (
          <>
            {/* Info Section */}
            <Card>
              <CardContent>
                <Accordion
                  type="single"
                  collapsible
                  className="text-sm text-muted-foreground"
                >
                  <AccordionItem value="stakeholder">
                    <AccordionTrigger className="text-base font-semibold text-foreground">
                      Stakeholder Details
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      {/* Stakeholder Info Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-4">
                        {/* Left Column */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              Name:
                            </span>
                            <p className="capitalize text-black">
                              {clientStakeholder.name}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              Email:
                            </span>
                            <Badge variant="outline" className="px-3 py-1">
                              {clientStakeholder.email}
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
                                clientStakeholder.isDeleted
                                  ? "bg-red-600 text-white"
                                  : "bg-green-600 text-white"
                              }`}
                            >
                              {clientStakeholder.isDeleted
                                ? "Deleted"
                                : "Active"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              Phone:
                            </span>
                            <Badge variant="outline" className="px-3 py-1">
                              {clientStakeholder.phone}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Client Info Row */}
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="font-medium text-foreground">
                          Client Name:
                        </span>
                        <Badge variant="outline" className="px-3 py-1">
                          {clientStakeholder.client.name}
                        </Badge>
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
                              {clientStakeholder.createdBy?.email}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(clientStakeholder.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-foreground">
                              Updated By:
                            </span>
                            <p className="text-black">
                              {clientStakeholder.updatedBy?.email}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(clientStakeholder.updatedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
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
                      Projects ({clientStakeholder.projects?.length || 0})
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      {clientStakeholder.projects.length === 0 ? (
                        <div className="text-muted-foreground italic">
                          No projects assigned to this stakeholder yet.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                          {clientStakeholder.projects.map((project, index) => (
                            <div
                              key={index}
                              className="space-y-2 border p-4 rounded-md"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">
                                  Project Name:
                                </span>
                                <p className="text-black">{project.name}</p>
                              </div>
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
            No client stakeholder data found.
          </div>
        )}
      </div>
    </>
  );
}
