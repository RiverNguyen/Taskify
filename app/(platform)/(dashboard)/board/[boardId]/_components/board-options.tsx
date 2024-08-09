"use client";

import { deleteBoard } from "@/actions/delete-board";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAction } from "@/hooks/use-action";
import { PopoverClose } from "@radix-ui/react-popover";
import { MoreHorizontal, Trash, X } from "lucide-react";
import { toast } from "sonner";

interface BoardOptionsProps {
  id: string;
}

export const BoardOptions = ({ id }: BoardOptionsProps) => {
  const { execute, isLoading } = useAction(deleteBoard, {
    onSuccess: (data) => {
      toast.success(`Board deleted`, {
        description: `Board ${data.title} has been deleted`,
      });
    },
    onError: (error) => {
      toast.error("Failed to delete board");
      console.log(error);
    },
  });

  const onDelete = () => {
    execute({ id });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant={"transparent"}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 py-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Board Action
        </div>
        <PopoverClose asChild>
          <Button
            className="w-auto h-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant={"ghost"}
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          variant={"ghost"}
          onClick={onDelete}
          disabled={isLoading}
          className="rounded-none w-full h-auto p-2 px-2 justify-start font-normal text-sm"
        >
          <Trash className="h-4 w-4 text-red-500 mr-2" /> Delete this board
        </Button>
      </PopoverContent>
    </Popover>
  );
};
