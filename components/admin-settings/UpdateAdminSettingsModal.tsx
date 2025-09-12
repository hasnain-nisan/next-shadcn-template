/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ServiceFactory } from "@/services/ServiceFactory";
import { AdminSettings } from "@/types/adminSettings.types";
import { Textarea } from "../ui/Textarea";
import { IconLoader2 } from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  settings: AdminSettings | null;
  onUpdated: () => void;
}

export function UpdateAdminSettingsModal({
  open,
  setOpen,
  settings,
  onUpdated,
}: Readonly<Props>) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Partial<AdminSettings>>();

  useEffect(() => {
    if (settings) {
      const {
        id,
        createdBy,
        updatedBy,
        createdAt,
        updatedAt,
        isDeleted,
        ...safeSettings
      } = settings;

      reset(safeSettings);
    }
  }, [settings, reset]);

  const onSubmit = async (data: Partial<AdminSettings>) => {
    if (!settings) return;
    try {
      const service = ServiceFactory.getAdminSettingsService();
      await service.update(settings.id, data);
      onUpdated();
      setOpen(false);
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full sm:max-w-lg md:max-w-5xl max-h-[90vh] overflow-y-auto px-4 sm:px-6 md:px-8">
        <DialogHeader className="mb-5">
          <DialogTitle>Update Admin Settings</DialogTitle>
          <DialogDescription>
            Modify service account credentials and configuration. Be cautious
            when updating sensitive fields like private key or client email.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Required Fields */}
            <div>
              <Label htmlFor="type" className="mb-2 block">
                Type
              </Label>
              <Controller
                name="type"
                control={control}
                rules={{ required: "Type is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="service_account">
                        Service Account
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.type.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="clientEmail" className="mb-2 block">
                Client Email
              </Label>
              <Input
                id="clientEmail"
                {...register("clientEmail", {
                  required: "Client email is required",
                })}
              />
              {errors.clientEmail && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.clientEmail.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="privateKey" className="mb-2 block">
                Private Key
              </Label>
              <Textarea
                id="privateKey"
                rows={4}
                {...register("privateKey", {
                  required: "Private key is required",
                })}
              />
              {errors.privateKey && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.privateKey.message}
                </p>
              )}
            </div>

            {/* Optional Fields */}
            <div>
              <Label htmlFor="projectId" className="mb-2 block">
                Project ID
              </Label>
              <Input id="projectId" {...register("projectId")} />
            </div>

            <div>
              <Label htmlFor="privateKeyId" className="mb-2 block">
                Private Key ID
              </Label>
              <Input id="privateKeyId" {...register("privateKeyId")} />
            </div>

            <div>
              <Label htmlFor="clientId" className="mb-2 block">
                Client ID
              </Label>
              <Input id="clientId" {...register("clientId")} />
            </div>

            <div>
              <Label htmlFor="authUri" className="mb-2 block">
                Auth URI
              </Label>
              <Input id="authUri" {...register("authUri")} />
            </div>

            <div>
              <Label htmlFor="tokenUri" className="mb-2 block">
                Token URI
              </Label>
              <Input id="tokenUri" {...register("tokenUri")} />
            </div>

            <div>
              <Label htmlFor="authProviderX509CertUrl" className="mb-2 block">
                Auth Provider Cert URL
              </Label>
              <Input
                id="authProviderX509CertUrl"
                {...register("authProviderX509CertUrl")}
              />
            </div>

            <div>
              <Label htmlFor="clientX509CertUrl" className="mb-2 block">
                Client Cert URL
              </Label>
              <Input
                id="clientX509CertUrl"
                {...register("clientX509CertUrl")}
              />
            </div>

            <div>
              <Label htmlFor="universeDomain" className="mb-2 block">
                Universe Domain
              </Label>
              <Input id="universeDomain" {...register("universeDomain")} />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
