// EmailTagInput.tsx

import React, { useState } from "react";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form"; // ⬅️ Import FieldValues and Path
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { IconX } from "@tabler/icons-react";

// Define the expected props using generics
// TForm extends FieldValues (any form structure)
// TName extends Path<TForm> (any key in that form)
interface EmailTagInputProps<
  TForm extends FieldValues,
  TName extends Path<TForm>
> {
  // The value is TForm[TName], which should be string[] or string[] | undefined
  field: ControllerRenderProps<TForm, TName>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Make the component generic
export function EmailTagInput<
  TForm extends FieldValues,
  TName extends Path<TForm>
>({ field }: Readonly<EmailTagInputProps<TForm, TName>>) {
  const [currentEmailInput, setCurrentEmailInput] = useState("");

  // Safely cast the value to string[] since we expect it to be an array of strings
  // If react-hook-form starts with undefined, this ensures the logic doesn't crash.
  // We'll rely on the defaultValues being [] in the consuming form.
  const emails: string[] = (field.value as string[] | undefined) || [];

  // --- The rest of the logic uses 'emails' instead of 'field.value' directly ---

  const handleAddTag = (email: string) => {
    const trimmedEmail = email.trim();
    if (trimmedEmail && EMAIL_REGEX.test(trimmedEmail)) {
      // Check for duplicates before adding
      if (!emails.includes(trimmedEmail)) {
        // Use field.onChange to update react-hook-form state
        // Pass a new array back to the form
        field.onChange([...emails, trimmedEmail] as string[]);
      }
      setCurrentEmailInput("");
    } else if (trimmedEmail) {
      toast.error(`Invalid email format: ${trimmedEmail}`);
      setCurrentEmailInput("");
    }
  };

  const handleRemoveTag = (emailToRemove: string) => {
    // Pass a new filtered array back to the form
    field.onChange(
      emails.filter((email: string) => email !== emailToRemove)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = (e.target as HTMLInputElement).value;

    if (e.key === "Enter" || e.key === "Tab" || e.key === ",") {
      e.preventDefault();
      if (e.key === ",") {
        const emailPart = input.slice(0, -1).trim();
        if (emailPart) {
          handleAddTag(emailPart);
        }
      } else {
        handleAddTag(input);
      }
    }

    // Handle backspace when input is empty to remove the last tag
    if (
      e.key === "Backspace" &&
      currentEmailInput === "" &&
      emails.length > 0 // Use 'emails' here
    ) {
      e.preventDefault();
      const lastEmail = emails.at(-1)!; // Use 'emails' here
      handleRemoveTag(lastEmail);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border border-input rounded-md min-h-10 p-2">
      {/* Render Tags (Badges) using 'emails' */}
      {emails.map((email: string) => (
        <Badge
          key={email}
          variant="secondary"
          className="pr-1 font-normal cursor-pointer text-black"
          onClick={() => handleRemoveTag(email)}
        >
          {email}
          <IconX className="ml-1 h-3 w-3" />
        </Badge>
      ))}

      {/* Input Field */}
      <Input
        id="outputEmailsInput"
        type="email"
        className="flex-1 border-none shadow-none focus-visible:ring-0 p-0 h-auto min-w-[150px]"
        placeholder={emails.length === 0 ? "Add recipients..." : ""} // Use 'emails' here
        value={currentEmailInput}
        onChange={(e) => setCurrentEmailInput(e.target.value)}
        onBlur={() => handleAddTag(currentEmailInput)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
