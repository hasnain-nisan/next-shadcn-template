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

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRefetch: (state: boolean) => void;
  projects: { id: string; name: string }[];
};

type CreateConfigFormValues = {
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
};

const defaultUsCategories: Record<string, string> = {
  MarTech:
    "User stories related to the marketing technology platforms, tools, and systems used to enable Purinas marketing capabilities",
  "Data Strategy":
    "User stories related to the collection, management, and activation of consumer data",
  Measurement:
    "User stories related to tracking, analyzing, and reporting data to assess campaign performance and effectiveness across paid, earned, shared, and owned media",
  Taxonomy:
    "User stories related data classification, structure, and naming conventions to enable cross-system and channel tracking",
  Adverity: "User stories related to Adverities capabilities and integrations",
  "Data Governance":
    "User stories related to the policies, procedures, and standards for managing data integrity, security, quality, and availability",
  "Ways of Working":
    "User stories related to processes, methodologies, and collaboration practices within the team or organization",
  DAM: "User stories related to Digital Asset Management systems and processes",
  Workflow:
    "User stories related to the automation, optimization, and management of business processes and tasks using a workflow management platform",
};

export function CreateConfigModal({
  open,
  setOpen,
  setRefetch,
  projects,
}: Readonly<Props>) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateConfigFormValues>({
    defaultValues: {
      projectId: "",
      example1:
        "As a Sr Analyst of Marketing Activations I need an integrated data management system connecting Master Data Management, Brand Marketing, and Sales so that I can enhance operational efficiency and enable seamless cross-functional collaboration",
      example2:
        "As a Executive Creative Director I need AI-powered performance prediction and real-time content adaptation so that I can optimize creative assets dynamically and improve campaign effectiveness",
      example3:
        "As a CRM and Digital Strategy Lead I need to ensure consumer data is accurately captured, centralized, and enriched with key attributes so that activation campaigns can scale efficiently across platforms and channels",
      categories_flag: "Y",
      us_categories: defaultUsCategories,
      email_confirmation: [],
      interview_tracker_gdrive_id: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onSubmit = async (data: CreateConfigFormValues) => {
    try {
      setIsSubmitting(true);
      const configService = ServiceFactory.getConfigService();
      await configService.create({
        projectId: data.projectId,
        config: data,
      });
      toast.success("Config created successfully");
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
          <DialogTitle>Create Config</DialogTitle>
          <DialogDescription>
            Fill in config details and link to a project.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          // Removed the grid classes entirely to use a single column flow,
          // relying on the space-y-4 of the container
          className="space-y-4"
        >
          {/* All fields are now placed sequentially in this single block */}
          <div className="space-y-4">
            {/* Project Selection */}
            <div>
              <Label className="mb-1">Project</Label>
              <Controller
                name="projectId"
                control={control}
                // Added back the required rule which was commented out
                rules={{ required: "Project is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full h-[36px] text-sm">
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

            {/* Examples */}
            {["example1", "example2", "example3"].map((field) => (
              <div key={field}>
                <Label className="mb-1">{field}</Label>
                <textarea
                  rows={5}
                  className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  {...register(field as keyof CreateConfigFormValues)}
                />
              </div>
            ))}

            {/* Categories Flag */}
            <div>
              <Label className="mb-1">Categories Flag</Label>
              <Input
                type="text"
                {...register("categories_flag", { required: true })}
              />
            </div>

            {/* Custom Context */}
            <div>
              <Label className="mb-1">Custom Context</Label>
              <textarea
                rows={5}
                className="w-full rounded border px-3 py-2 text-sm"
                {...register("custom_context")}
              />
            </div>

            {/* Email Confirmation */}
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
                  />
                )}
              />
            </div>

            {/* US Categories */}
            <div>
              <Label className="mb-1">US Categories</Label>
              <Controller
                name="us_categories"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    {Object.entries(field.value).map(([key, value], idx) => (
                      <div key={idx} className="flex gap-2 items-start">
                        <Input
                          value={key}
                          onChange={(e) => {
                            const updated = { ...field.value };
                            const newKey = e.target.value;
                            // This handles renaming the key
                            updated[newKey] = updated[key];
                            delete updated[key];
                            field.onChange(updated);
                          }}
                          placeholder="Category key"
                          className="w-1/5"
                        />
                        <textarea
                          value={value}
                          onChange={(e) => {
                            const updated = {
                              ...field.value,
                              [key]: e.target.value,
                            };
                            field.onChange(updated);
                          }}
                          placeholder="Category description"
                          className="w-4/5 rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          rows={3}
                        />
                        {/* Delete Button */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive mt-2"
                          onClick={() => {
                            const updated = { ...field.value };
                            delete updated[key];
                            field.onChange(updated);
                          }}
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

            {/* GDrive URLs */}
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
                  {...register(field as keyof CreateConfigFormValues, {
                    ...(field === "interview_tracker_gdrive_id"
                      ? {
                          required: "Interview tracker GDrive ID is required",
                          validate: (v) =>
                            (typeof v === "string" ? v.trim() : "") !== "" ||
                            "This field cannot be empty",
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
          <DialogFooter className="mt-4">
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
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}