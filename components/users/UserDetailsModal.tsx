"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@/types/user.types";

type Props = {
  user: User | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function UserDetailsModal({ user, open, setOpen }: Readonly<Props>) {
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh] flex flex-col px-4 md:px-6 lg:px-8">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-semibold">
            User Details
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Overview of user information and permissions
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-grow overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Basic Info */}
            <Card className="p-4 rounded-xl border shadow-sm">
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                Basic Info
              </h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium text-muted-foreground">ID:</span>{" "}
                  {user.id}
                </p>
                <p>
                  <span className="font-medium text-muted-foreground">
                    Email:
                  </span>{" "}
                  {user.email}
                </p>
                <p>
                  <span className="font-medium text-muted-foreground">
                    Role:
                  </span>{" "}
                  <Badge className="text-xs">{user.role}</Badge>
                </p>
                <p>
                  <span className="font-medium text-muted-foreground">
                    Created At:
                  </span>{" "}
                  {new Date(user.createdAt).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium text-muted-foreground">
                    Updated At:
                  </span>{" "}
                  {new Date(user.updatedAt).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium text-muted-foreground">
                    Status:
                  </span>{" "}
                  {user.isDeleted ? (
                    <Badge variant="destructive" className="text-xs">
                      Deleted
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      Active
                    </Badge>
                  )}
                </p>
              </div>
            </Card>

            {/* Access Scopes */}
            <Card className="p-4 rounded-xl border shadow-sm">
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                Access Scopes
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(user.accessScopes).map(
                  ([key, value]) =>
                    value && (
                      <Badge
                        key={key}
                        variant="secondary"
                        className="capitalize text-xs"
                      >
                        {key.replace("canManage", "")}
                      </Badge>
                    )
                )}
              </div>
            </Card>

            {/* Created By */}
            {user.createdBy && (
              <Card className="p-4 rounded-xl border shadow-sm">
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                  Created By
                </h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium text-muted-foreground">
                      Email:
                    </span>{" "}
                    {user.createdBy.email}
                  </p>
                  <p>
                    <span className="font-medium text-muted-foreground">
                      Role:
                    </span>{" "}
                    <Badge className="text-xs">{user.createdBy.role}</Badge>
                  </p>
                </div>
              </Card>
            )}

            {/* Updated By */}
            {user.updatedBy && (
              <Card className="p-4 rounded-xl border shadow-sm">
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                  Updated By
                </h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium text-muted-foreground">
                      Email:
                    </span>{" "}
                    {user.updatedBy.email}
                  </p>
                  <p>
                    <span className="font-medium text-muted-foreground">
                      Role:
                    </span>{" "}
                    <Badge className="text-xs">{user.updatedBy.role}</Badge>
                  </p>
                </div>
              </Card>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="mt-6">
          <Button variant="secondary" onClick={() => handleOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
