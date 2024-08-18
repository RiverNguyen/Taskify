"use client";

import { createBoard } from "@/actions/create-board";
import { updateCard } from "@/actions/update-card";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { CardWithList } from "@/type";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { FormInput } from "./form-input";
import { FormPicker } from "./form-picker";
import { FormSubmit } from "./form-submit";

interface FormPopoverProps {
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  card?: boolean;
  boardId?: string;
  data?: CardWithList;
}

export const FormPopover = ({
  children,
  side = "bottom",
  align,
  sideOffset = 0,
  card = false,
  boardId,
  data,
}: FormPopoverProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const closeRef = useRef<ElementRef<"button">>(null);

  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      toast.success("Board created successfully", {
        description: `Board "${data.title}" has been created.`,
      });
      closeRef.current?.click();
      router.push(`/board/${data.id}`);
    },
    onError: (error) => {
      console.log({ error });
      toast.error(error);
    },
  });

  const { execute: executeUpdateCard, isLoading } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["card", data.id],
      });

      toast.success("Upload image successfully");

      closeRef.current?.click();
    },
    onError: (error) => {
      console.log(error);
      toast.error("Failed to upload image");
    },
  });

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const image = formData.get("image") as string;

    execute({ title, image });
  };

  const onUpload = (formData: FormData) => {
    const image = formData.get("image") as string | undefined;
    const boardId = formData.get("boardId") as string;
    const id = formData.get("id") as string;

    executeUpdateCard({ id, boardId, image });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align={align}
        sideOffset={sideOffset}
        side={side}
        className="w-80 pt-3"
      >
        {card ? (
          <div className="text-sm font-medium text-center text-neutral-600 pb-4">
            Upload card image
          </div>
        ) : (
          <div className="text-sm font-medium text-center text-neutral-600 pb-4">
            Create board
          </div>
        )}

        <PopoverClose ref={closeRef} asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600 focus-visible:ring-0 focus-visible:ring-offset-0 "
            variant={"ghost"}
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        {card ? (
          <form action={onUpload} className="space-y-4">
            <div className="space-y-4">
              <input hidden id="boardId" name="boardId" value={boardId} />
              <input hidden id="id" name="id" value={data?.id} />
              <FormPicker id="image" errors={fieldErrors} />
            </div>
            <FormSubmit
              disabled={isLoading}
              variant="primary"
              className="w-full"
            >
              Upload
            </FormSubmit>
          </form>
        ) : (
          <form action={onSubmit} className="space-y-4">
            <div className="space-y-4">
              <FormPicker id="image" errors={fieldErrors} />
              <FormInput
                id="title"
                label="Board title"
                type="text"
                placeholder="Title..."
                errors={fieldErrors}
                className="focus-visible:ring-1"
              />
            </div>
            <FormSubmit variant="primary" className="w-full">
              Create
            </FormSubmit>
          </form>
        )}
      </PopoverContent>
    </Popover>
  );
};
