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
import { Config } from "@/types/config.types";

export default function ProjectDetailsPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = React.use(params);

  const [configVersion, setConfigVersion] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const service = ServiceFactory.getConfigService();
        const data = (await service.getById(id)) as unknown as {
          data: Config;
        };
        setConfigVersion(data as unknown as Config);
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
          href="/dashboard/configs"
          className="hover:text-foreground font-medium"
        >
          Configs
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
          Explore project information, client details, config, and categories.
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
        ) : configVersion ? (
          <>
            {/* Project Info */}
            <Card>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="project">
                    <AccordionTrigger className="text-base font-semibold text-foreground">
                      Project Details
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      {/* Basic Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              Name:
                            </span>
                            <p className="text-black">
                              {configVersion?.project?.name || "N/A"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              Client Team:
                            </span>
                            <Badge variant="outline" className="px-3 py-1">
                              {configVersion?.project?.clientTeam || "N/A"}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              Status:
                            </span>
                            {configVersion.project ? (
                              <Badge
                                className={`px-3 py-1 ${
                                  configVersion.project.isDeleted
                                    ? "bg-red-600 text-white"
                                    : "bg-green-600 text-white"
                                }`}
                              >
                                {configVersion.project.isDeleted
                                  ? "Deleted"
                                  : "Active"}
                              </Badge>
                            ) : (
                              <Badge>N/A</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              Project ID:
                            </span>
                            <Badge
                              variant="outline"
                              className="px-3 py-1 font-mono text-xs"
                            >
                              {configVersion?.project?.id || "N/A"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Client Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div className="flex gap-2 items-center">
                          <span className="font-medium text-foreground">
                            Client Name:
                          </span>
                          <Badge variant="outline" className="px-3 py-1">
                            {configVersion?.project?.client?.name || "N/A"}
                          </Badge>
                        </div>
                        <div className="flex gap-2 items-center">
                          <span className="font-medium text-foreground">
                            Client Code:
                          </span>
                          <Badge variant="outline" className="px-3 py-1">
                            {configVersion?.project?.client?.clientCode || "N/A"}
                          </Badge>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <h3 className="font-semibold text-foreground">
                          Description
                        </h3>
                        <p className="text-black">
                          {configVersion?.project?.description ||
                            "No description provided"}
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Config Section */}
            <Card>
              <CardContent className="space-y-6">
                <Accordion type="single" collapsible>
                  <AccordionItem value="config">
                    <AccordionTrigger className="text-base font-semibold text-foreground">
                      Config Details
                    </AccordionTrigger>

                    <AccordionContent className="space-y-8 pt-4">
                      {/* Examples */}
                      <section>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                          Examples
                        </h3>
                        <ul className="list-disc pl-5 space-y-2 text-foreground leading-relaxed">
                          <li>{configVersion.config.example1}</li>
                          <li>{configVersion.config.example2}</li>
                          <li>{configVersion.config.example3}</li>
                        </ul>
                      </section>

                      {/* US Categories */}
                      <section>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                          US Categories
                        </h3>
                        <ul className="list-disc pl-5 space-y-2 text-foreground leading-relaxed">
                          {Object.entries(
                            configVersion.config.us_categories
                          ).map(([key, value]) => (
                            <li key={key}>
                              <span className="font-semibold">{key}:</span>{" "}
                              {value}
                            </li>
                          ))}
                        </ul>
                      </section>

                      {/* Metadata */}
                      <section>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                          Config Metadata
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                          {[
                            ["Client", configVersion.config.client],
                            ["Client Code", configVersion.config.client_code],
                            ["Project Name", configVersion.config.project_name],
                            [
                              "Project Description",
                              configVersion.config.project_desc,
                            ],
                            [
                              "Categories Flag",
                              configVersion.config.categories_flag,
                            ],
                            [
                              "Custom Context",
                              configVersion.config.custom_context || "—",
                            ],
                          ].map(([label, value]) => (
                            <div key={label}>
                              <p className="text-sm text-muted-foreground mb-1">
                                {label}
                              </p>
                              <p className="text-foreground">{value}</p>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* Email Confirmations */}
                      <section>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                          Email Confirmations
                        </h3>
                        {configVersion.config.email_confirmation.length > 0 ? (
                          <ul className="list-disc pl-5 space-y-1 text-foreground">
                            {configVersion.config.email_confirmation.map(
                              (email, idx) => (
                                <li key={idx}>{email}</li>
                              )
                            )}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground">—</p>
                        )}
                      </section>

                      {/* GDrive URLs */}
                      <section>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                          GDrive Links
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                          {[
                            // [
                            //   "Interview Tracker GDrive ID",
                            //   configVersion.config.interview_tracker_gdrive_id,
                            // ],
                            [
                              "Interview Repository GDrive URL",
                              configVersion.config
                                .interview_repository_gdrive_url,
                            ],
                            [
                              "Global Repository GDrive URL",
                              configVersion.config.global_repository_gdrive_url,
                            ],
                            [
                              "Output GDrive URL",
                              configVersion.config.output_gdrive_url,
                            ],
                            [
                              "Logging Output URL",
                              configVersion.config.logging_output_url,
                            ],
                          ].map(([label, value]) => (
                            <div key={label}>
                              <p className="text-sm text-muted-foreground mb-1">
                                {label}
                              </p>
                              <p className="font-mono text-xs text-foreground break-all">
                                {value || "—"}
                              </p>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* Audit Trail */}
                      <section className="border-t pt-6">
                        <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                          Audit Trail
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Created By
                            </p>
                            <p className="text-foreground">
                              {configVersion.created_by?.email || "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Updated By
                            </p>
                            <p className="text-foreground">
                              {configVersion.updated_by?.email || "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Created At
                            </p>
                            <p className="text-foreground">
                              {new Date(
                                configVersion.created_at
                              ).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Updated At
                            </p>
                            <p className="text-foreground">
                              {new Date(
                                configVersion.updated_at
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </section>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="text-center text-sm text-muted-foreground py-10">
            No config data found.
          </div>
        )}
      </div>
    </>
  );
}
