"use client";

import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import { FormPopover } from "@/components/form/form-popover";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { useCardModal } from "@/hooks/use-card-modal";
import { CardWithList } from "@/type";
import { Copy, ImageUp, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface ActionsProps {
  data: CardWithList;
}

export const Actions = ({ data }: ActionsProps) => {
  const params = useParams();
  const cardModal = useCardModal();

  const { execute: executeCopyCard, isLoading: copyLoading } = useAction(
    copyCard,
    {
      onSuccess: (data) => {
        toast.success(`Card ${data.title} copied successfully`);
        cardModal.onClose();
      },
      onError: (error) => {
        toast.error("Failed to copy card");
        console.log(error);
      },
    }
  );

  const { execute: executeDeleteCard, isLoading: deleteLoading } = useAction(
    deleteCard,
    {
      onSuccess: () => {
        toast.success(`Card ${data.title} deleted successfully`);
        cardModal.onClose();
      },
      onError: (error) => {
        toast.error("Failed to delete card");
        console.log(error);
      },
    }
  );

  const onCopy = () => {
    const boardId = params.boardId as string;

    executeCopyCard({ id: data.id, boardId });
  };

  const onDelete = () => {
    const boardId = params.boardId as string;

    executeDeleteCard({ id: data.id, boardId });
  };
  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs font-semibold">Actions</p>
      <FormPopover
        sideOffset={10}
        side="right"
        card={true}
        data={data}
        boardId={params.boardId as string}
      >
        <Button variant={"gray"} size="inline" className="w-full justify-start">
          <ImageUp className="h-4 w-4 mr-2" />
          Image
        </Button>
      </FormPopover>
      <Button
        onClick={onCopy}
        variant={"gray"}
        size="inline"
        className="w-full justify-start"
        disabled={copyLoading}
      >
        <Copy className="h-4 w-4 mr-2" />
        Copy
      </Button>
      <Button
        onClick={onDelete}
        disabled={deleteLoading}
        variant={"gray"}
        size="inline"
        className="w-full justify-start"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </div>
  );
};

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
    </div>
  );
};
