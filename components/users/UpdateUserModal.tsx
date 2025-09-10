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
import { AccessScopeSelector } from "@/components/users/AccessScopeSelector";
import { useEffect, useState } from "react";
import { IconEye, IconEyeOff, IconLoader2 } from "@tabler/icons-react";
import { ServiceFactory } from "@/services/ServiceFactory";
import { User } from "@/types/user.types";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRefetch: (state: boolean) => void;
  user: User | null;
};

type UpdateUserFormValues = {
  email: string;
  role: "Admin" | "SuperAdmin";
  password?: string;
  confirmPassword?: string;
  accessScopes: {
    canManageUsers?: boolean;
    canManageClients?: boolean;
    canManageProjects?: boolean;
    canManageInterviews?: boolean;
    canManageStakeholders?: boolean;
  };
};

export function UpdateUserModal({
  open,
  setOpen,
  setRefetch,
  user,
}: Readonly<Props>) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UpdateUserFormValues>({
    defaultValues: {
      email: "",
      role: "Admin",
      password: "",
      confirmPassword: "",
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

  useEffect(() => {
    if (user) {
      reset({
        email: user.email,
        role: user.role as "Admin" | "InterviewUser",
        accessScopes: user.accessScopes,
        password: "",
        confirmPassword: "",
      });
    }
  }, [user, reset]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) reset();
    setOpen(isOpen);
  };

  const onSubmit = async (data: UpdateUserFormValues) => {
    if (!user) return;
    try {
      setIsSubmitting(true);
      const userService = ServiceFactory.getUserService();
      await userService.updateUser(user.id, {
        email: data.email,
        role: data.role,
        accessScopes: data.accessScopes as unknown as User["accessScopes"],
        password: data.password?.trim() ? data.password.trim() : undefined,
        confirmPassword: data.confirmPassword?.trim()
          ? data.confirmPassword.trim()
          : undefined,
      });
      toast.success("User updated successfully");
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
          <DialogTitle>Update User</DialogTitle>
          <DialogDescription>
            Modify user details and access permissions.
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

          {/* Role */}
          <Controller
            name="role"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
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
              </div>
            )}
          />

          {/* Access Scopes Selector */}
          <Controller
            name="accessScopes"
            control={control}
            render={({ field }) => (
              <AccessScopeSelector
                type="update"
                role={watch("role")}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {Object.values(watch("accessScopes")).every((v) => !v) && (
            <p
              className="text-xs text-red-500"
              style={{ marginTop: "-0.7rem" }}
            >
              At least one access scope must be selected
            </p>
          )}

          {/* Password Section Label */}
          <div>
            <p className="text-sm text-muted-foreground font-medium mt-8">
              To change the user&apos;s password, please fill in the fields
              below.
            </p>
          </div>

          {/* Password */}
          <div className="relative">
            <Label className="mb-2">Password</Label>
            <Input
              type={showPassword ? "text" : "password"}
              {...register("password", {
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
                validate: (value, formValues) =>
                  !formValues.password ||
                  value === formValues.password ||
                  "Passwords do not match",
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
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
