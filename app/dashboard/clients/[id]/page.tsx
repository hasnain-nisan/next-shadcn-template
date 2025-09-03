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
              <CardHeader>
                <CardTitle className="text-lg">Client Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium text-foreground">Name:</span>
                    <br />
                    {client.name}
                  </div>
                  <div>
                    <span className="font-medium text-foreground">
                      Client Code:
                    </span>
                    <br />
                    <Badge variant="outline">{client.clientCode}</Badge>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">
                      Created At:
                    </span>
                    <br />
                    {new Date(client.createdAt).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium text-foreground">
                      Created By:
                    </span>
                    <br />
                    {client.createdBy?.email || "—"}
                  </div>
                  <div>
                    <span className="font-medium text-foreground">
                      Updated At:
                    </span>
                    <br />
                    {new Date(client.updatedAt).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium text-foreground">
                      Updated By:
                    </span>
                    <br />
                    {client.updatedBy?.email || "—"}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Projects Section */}
            {client.projects.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Projects</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  {client.projects.map((project, index) => (
                    <div key={index}>
                      <span className="font-medium">Project {index + 1}:</span>{" "}
                      {project.name || "Unnamed Project"}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Stakeholders Section */}
            {client.stakeholders.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Stakeholders</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  {client.stakeholders.map((stakeholder, index) => (
                    <div key={index}>
                      <span className="font-medium">
                        Stakeholder {index + 1}:
                      </span>{" "}
                      {stakeholder.name || "Unnamed Stakeholder"}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Interviews Section */}
            {client.interviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Interviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  {client.interviews.map((interview, index) => (
                    <div key={index}>
                      <span className="font-medium">
                        Interview {index + 1}:
                      </span>{" "}
                      {interview.title || "Untitled Interview"}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
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
