"use client";

import { Input } from "@/components/ui/input";
import { useFormStatus } from "react-dom";

interface FormInputProps {
  errors?: {
    title?: string[];
  };
}
export const FormInput = ({ errors }: FormInputProps) => {
  const { pending } = useFormStatus();
  return (
    <>
      <Input
        type="text"
        id="title"
        name="title"
        placeholder="Title..."
        className="border-input p-1 border"
        disabled={pending}
      />
      {errors?.title ? (
        <div className="">
          {errors.title.map((error: string) => (
            <p key={error} className="text-rose-500">
              {error}
            </p>
          ))}
        </div>
      ) : null}
    </>
  );
};
