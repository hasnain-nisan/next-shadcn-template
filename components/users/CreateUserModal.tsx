"use client";

import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setReFetch: (state: boolean) => void;
};

type CreateUserFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
  role: "Admin";
  accessScopes: {
    canManageUsers?: boolean;
    canManageClients?: boolean;
    canManageProjects?: boolean;
    canManageInterviews?: boolean;
    canManageStakeholders?: boolean;
  };
};

export function CreateUserModal({
  open,
  setOpen,
  setReFetch,
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
      role: "Admin",
      accessScopes: {
        canManageUsers: false,
        canManageClients: false,
        canManageProjects: false,
        canManageInterviews: false,
        canManageStakeholders: false,
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
      const res = await userService.createUser(data as Partial<User>);
      toast.success("Admin user created successfully");
      reset();
      setOpen(false);
      setReFetch(true);
      console.log("create user response", res);
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
          <div>
            <Label className="mb-2">Role</Label>
            <select
              className="w-full rounded border px-2 py-1 text-sm"
              {...register("role", { required: true })}
            >
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Access Scopes Selector */}
          <Controller
            name="accessScopes"
            control={control}
            render={({ field }) => (
              <AccessScopeSelector
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
