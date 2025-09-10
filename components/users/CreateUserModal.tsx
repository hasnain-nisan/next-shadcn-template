"use client";

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
import { AccessScopeSelector } from "@/components/users/AccessScopeSelector"; // <-- import selector component
import { useState } from "react";
import { IconEye, IconEyeOff, IconLoader2 } from "@tabler/icons-react";
import { ServiceFactory } from "@/services/ServiceFactory";
import { User } from "@/types/user.types";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRefetch: (state: boolean) => void;
};

type CreateUserFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
  role: "" | "Admin" | "InterviewUser";
  accessScopes: {
    // Users
    canAccessUsers?: boolean;
    canCreateUsers?: boolean;
    canUpdateUsers?: boolean;
    canDeleteUsers?: boolean;

    // Clients
    canAccessClients?: boolean;
    canCreateClients?: boolean;
    canUpdateClients?: boolean;
    canDeleteClients?: boolean;

    // Stakeholders
    canAccessStakeholders?: boolean;
    canCreateStakeholders?: boolean;
    canUpdateStakeholders?: boolean;
    canDeleteStakeholders?: boolean;

    // Projects
    canAccessProjects?: boolean;
    canCreateProjects?: boolean;
    canUpdateProjects?: boolean;
    canDeleteProjects?: boolean;

    // Interviews
    canAccessInterviews?: boolean;
    canCreateInterviews?: boolean;
    canUpdateInterviews?: boolean;
    canDeleteInterviews?: boolean;

    // N8N Configs
    canAccessConfig?: boolean;
    canCreateConfig?: boolean;
    canUpdateConfig?: boolean;
    canDeleteConfig?: boolean;

    // Admin Settings
    canAccessAdminSettings?: boolean;
    canUpdateAdminSettings?: boolean;
  };
};

export function CreateUserModal({
  open,
  setOpen,
  setRefetch,
}: Readonly<Props>) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      accessScopes: {
        // Users
        canAccessUsers: false,
        canCreateUsers: false,
        canUpdateUsers: false,
        canDeleteUsers: false,

        // Clients
        canAccessClients: false,
        canCreateClients: false,
        canUpdateClients: false,
        canDeleteClients: false,

        // Stakeholders
        canAccessStakeholders: false,
        canCreateStakeholders: false,
        canUpdateStakeholders: false,
        canDeleteStakeholders: false,

        // Projects
        canAccessProjects: false,
        canCreateProjects: false,
        canUpdateProjects: false,
        canDeleteProjects: false,

        // Interviews
        canAccessInterviews: false,
        canCreateInterviews: false,
        canUpdateInterviews: false,
        canDeleteInterviews: false,

        // N8N Configs
        canAccessConfig: false,
        canCreateConfig: false,
        canUpdateConfig: false,
        canDeleteConfig: false,

        // Admin Settings
        canAccessAdminSettings: false,
        canUpdateAdminSettings: false,
      },
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Wrap setOpen so it resets form whenever modal closes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset(); // reset to defaultValues
    }
    setOpen(isOpen);
  };

  const onSubmit = async (data: CreateUserFormValues) => {
    try {
      setIsSubmitting(true);
      const userService = ServiceFactory.getUserService();
      await userService.createUser(data as Partial<User>);
      toast.success("Admin user created successfully");
      reset();
      setOpen(false);
      setRefetch(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="mb-5">
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            Enter user credentials and define their access within the system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <Label className="mb-2">Email</Label>
            <Input
              type="email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <Label className="mb-2">Password</Label>
            <Input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            </button>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Label className="mb-2">Confirm Password</Label>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword", {
                required: "Confirm password is required",
                minLength: {
                  value: 8,
                  message: "Confirm password must be at least 8 characters",
                },
                validate: (value, formValues) =>
                  value === formValues.password || "Passwords do not match",
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? (
                <IconEyeOff size={18} />
              ) : (
                <IconEye size={18} />
              )}
            </button>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Role */}
          <Controller
            name="role"
            control={control}
            rules={{ required: "Role is required" }}
            render={({ field, fieldState }) => (
              <div>
                <Label className="mb-2 block">Role</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full h-[36px] text-sm">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="InterviewUser">
                      Interview User
                    </SelectItem>
                  </SelectContent>
                </Select>

                {fieldState.error && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Access Scopes Selector */}
          <Controller
            name="accessScopes"
            control={control}
            render={({ field }) => (
              <AccessScopeSelector
                type="create"
                role={watch("role")}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {/* At least one scope validation */}
          {Object.values(watch("accessScopes")).every((v) => !v) && (
            <p
              className="text-xs text-red-500"
              style={{
                marginTop: "-0.7rem",
              }}
            >
              At least one access scope must be selected
            </p>
          )}

          {/* Actions */}
          <DialogFooter>
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
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
