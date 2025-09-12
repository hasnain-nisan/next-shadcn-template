/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { IconLoader2, IconEdit } from "@tabler/icons-react";
import { ServiceFactory } from "@/services/ServiceFactory";
import { useSession } from "next-auth/react";
import { AdminSettings } from "@/types/adminSettings.types";
import { UpdateAdminSettingsModal } from "@/components/admin-settings/UpdateAdminSettingsModal";

export default function AdminSettingsPage() {
  const { data: session } = useSession();
  const canUpdate =
    session?.user?.accessScopes?.canUpdateAdminSettings ?? false;

  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const fetchSettings = async () => {
    try {
      const service = ServiceFactory.getAdminSettingsService();
      const result = await service.getSingle();
      setSettings(result);
    } catch (error) {
      console.error("Failed to fetch admin settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground px-4 lg:px-6">
        <Link href="/dashboard" className="hover:text-foreground font-medium">
          Dashboard
        </Link>
        <Separator orientation="vertical" className="h-4" />
        <span className="text-foreground font-semibold">Admin Settings</span>
      </div>

      {/* Header */}
      <div className="px-4 lg:px-6 mb-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">
            Admin Settings
          </h1>
          <Button
            className="h-8 px-3 text-sm"
            onClick={() => setOpenUpdateModal(true)}
            disabled={!canUpdate}
          >
            <IconEdit className="size-4" />
            <span>Edit</span>
          </Button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage service account credentials and configuration.
        </p>
      </div>

      {/* Settings Card */}
      <div className="px-4 lg:px-6">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <IconLoader2 className="animate-spin text-muted-foreground h-5 w-5" />
            <span className="ml-2 text-sm text-muted-foreground">
              Loading settings...
            </span>
          </div>
        ) : settings ? (
          <div className="bg-muted/50 rounded-lg p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">
                Type
              </h2>
              <p className="text-base font-semibold">{settings.type}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">
                Client Email
              </h2>
              <p className="text-base font-semibold">{settings.clientEmail}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">
                Private Key
              </h2>
              <p className="text-sm font-mono text-muted-foreground truncate">
                {settings.privateKey?.slice(0, 60)}...
              </p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">
                Project ID
              </h2>
              <p className="text-base font-semibold">
                {settings.projectId ?? "—"}
              </p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">
                Private Key ID
              </h2>
              <p className="text-base font-semibold">
                {settings.privateKeyId ?? "—"}
              </p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">
                Client ID
              </h2>
              <p className="text-base font-semibold">
                {settings.clientId ?? "—"}
              </p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">
                Auth URI
              </h2>
              <p className="text-base font-semibold">
                {settings.authUri ?? "—"}
              </p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">
                Token URI
              </h2>
              <p className="text-base font-semibold">
                {settings.tokenUri ?? "—"}
              </p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">
                Auth Provider Cert URL
              </h2>
              <p className="text-base font-semibold">
                {settings.authProviderX509CertUrl ?? "—"}
              </p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">
                Client Cert URL
              </h2>
              <p className="text-base font-semibold">
                {settings.clientX509CertUrl ?? "—"}
              </p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">
                Universe Domain
              </h2>
              <p className="text-base font-semibold">
                {settings.universeDomain ?? "—"}
              </p>
            </div>

            {/* Audit Section */}
            <Separator />
            <div className="space-y-2 pt-4">
              <h2 className="text-sm font-medium text-muted-foreground">
                Audit Trail
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Created By</p>
                  <p className="text-sm font-semibold">
                    {settings.createdBy?.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(settings.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Updated By</p>
                  <p className="text-sm font-semibold">
                    {settings.updatedBy?.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(settings.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No settings found.</p>
        )}
      </div>

      {/* Update Modal */}
      <UpdateAdminSettingsModal
        open={openUpdateModal}
        setOpen={setOpenUpdateModal}
        settings={settings}
        onUpdated={fetchSettings}
      />
    </>
  );
}
