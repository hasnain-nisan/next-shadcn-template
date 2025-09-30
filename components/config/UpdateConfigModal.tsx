"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconLoader2, IconTrash } from "@tabler/icons-react";
import { ServiceFactory } from "@/services/ServiceFactory";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Config } from "@/types/config.types";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRefetch: (state: boolean) => void;
  config: Config | null;
  projects: { id: string; name: string }[];
};

type UpdateConfigFormValues = {
  projectId: string;
  example1?: string;
  example2?: string;
  example3?: string;
  categories_flag: string;
  us_categories: Record<string, string>;
  custom_context?: string;
  email_confirmation: string[];
  interview_tracker_gdrive_id: string;
  interview_repository_gdrive_url?: string;
  global_repository_gdrive_url?: string;
  output_gdrive_url?: string;
  logging_output_url?: string;
  change_summary?: string;
};

export function UpdateConfigModal({
  open,
  setOpen,
  setRefetch,
  config,
  projects,
}: Readonly<Props>) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<UpdateConfigFormValues>({
    defaultValues: {
      projectId: config?.projectId ?? "",
      ...config?.config,
      change_summary: config?.change_summary ?? "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (config && open) {
      reset({
        projectId: config.projectId,
        ...config.config,
        change_summary: config.change_summary ?? "",
      });
    }
  }, [config, open, reset]);

  const onSubmit = async (data: UpdateConfigFormValues) => {
    if (!config) return;
    try {
      setIsSubmitting(true);
      const configService = ServiceFactory.getConfigService();
      await configService.update(config.id, {
          ...data,
      });
      toast.success("Config updated successfully");
      setOpen(false);
      setRefetch(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-5">
          <DialogTitle>Update Config</DialogTitle>
          <DialogDescription>
            Modify config details and update the associated project.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Column 1 */}
          <div className="space-y-4">
            <div>
              <Label className="mb-1">Project</Label>
              <Controller
                name="projectId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={() => {}} disabled>
                    <SelectTrigger className="w-full h-[36px] text-sm" disabled>
                      <SelectValue placeholder="Select a project..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[250px] overflow-y-auto">
                      {projects.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.projectId && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.projectId.message}
                </p>
              )}
            </div>

            {["example1", "example2", "example3"].map((field) => (
              <div key={field}>
                <Label className="mb-1">{field}</Label>
                <textarea
                  rows={3}
                  className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  {...register(field as keyof UpdateConfigFormValues)}
                />
              </div>
            ))}

            <div>
              <Label className="mb-1">Categories Flag</Label>
              <Input
                type="text"
                {...register("categories_flag", { required: true })}
              />
            </div>

            <div>
              <Label className="mb-1">Custom Context</Label>
              <textarea
                rows={3}
                className="w-full rounded border px-3 py-2 text-sm"
                {...register("custom_context")}
              />
            </div>

            <div>
              <Label className="mb-1">Change Summary</Label>
              <textarea
                rows={2}
                className="w-full rounded border px-3 py-2 text-sm"
                {...register("change_summary")}
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <div>
              <Label className="mb-1">Email Confirmations</Label>
              <Controller
                name="email_confirmation"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Comma-separated emails"
                    onChange={(e) =>
                      field.onChange(
                        e.target.value
                          .split(",")
                          .map((email) => email.trim())
                          .filter((email) => email)
                      )
                    }
                    value={field.value.join(", ")}
                  />
                )}
              />
            </div>

            <div>
              <Label className="mb-1">US Categories</Label>
              <Controller
                name="us_categories"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    {Object.entries(field.value).map(([key, value], idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <Input
                          value={key}
                          onChange={(e) => {
                            const updated = { ...field.value };
                            const newKey = e.target.value;
                            updated[newKey] = updated[key];
                            delete updated[key];
                            field.onChange(updated);
                          }}
                          placeholder="Category key"
                          className="w-1/3"
                        />
                        <Input
                          value={value}
                          onChange={(e) => {
                            const updated = {
                              ...field.value,
                              [key]: e.target.value,
                            };
                            field.onChange(updated);
                          }}
                          placeholder="Category description"
                          className="w-2/3"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const updated = { ...field.value };
                            delete updated[key];
                            field.onChange(updated);
                          }}
                          className="text-destructive"
                        >
                          <IconTrash className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        field.onChange({
                          ...field.value,
                          [`New Category ${
                            Object.keys(field.value).length + 1
                          }`]: "",
                        })
                      }
                    >
                      Add Category
                    </Button>
                  </div>
                )}
              />
            </div>

            {[
              "interview_tracker_gdrive_id",
              "interview_repository_gdrive_url",
              "global_repository_gdrive_url",
              "output_gdrive_url",
              "logging_output_url",
            ].map((field) => (
              <div key={field}>
                <Label className="mb-1">{field.replace(/_/g, " ")}</Label>
                <Input
                  type="text"
                  {...register(field as keyof UpdateConfigFormValues, {
                    ...(field === "interview_tracker_gdrive_id"
                      ? {
                          required: "Interview tracker GDrive ID is required",
                          validate: (v) =>
                            (typeof v === 'string' ? v.trim() : '') !== "" || "This field cannot be empty",
                        }
                      : {}),
                  })}
                />
                {field === "interview_tracker_gdrive_id" &&
                  errors.interview_tracker_gdrive_id && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.interview_tracker_gdrive_id.message}
                    </p>
                  )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="md:col-span-2 flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
