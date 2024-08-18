"use client";

import { updateCard } from "@/actions/update-card";
import { FormInput } from "@/components/form/form-input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { CardWithList } from "@/type";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Layout } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";

interface HeaderProps {
  data: CardWithList;
}

const fetchCard = async (id: string) => {
  const response = await fetch(`/api/cards/${id}`);
  return response.json();
};

export const Header = ({ data }: HeaderProps) => {
  const queryClient = useQueryClient();
  const params = useParams();
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [title, setTitle] = useState(data.title);

  const { execute } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["card", data.id],
      });

      toast.success("Card updated successfully", {
        description: `Renamed card to ${data.title}`,
      });

      setTitle(data.title);
    },
    onError: (error) => {
      console.log(error);
      toast.error("Failed to update card");
    },
  });

  const inputRef = useRef<ElementRef<"input">>(null);

  const onBlur = () => {
    inputRef.current?.form?.requestSubmit();
  };

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const boardId = params.boardId as string;

    if (title === data.title) {
      return;
    }

    execute({ title, boardId, id: data.id });
  };

  const { data: cardData, isLoading } = useQuery({
    queryKey: ["card", data.id],
    queryFn: () => fetchCard(data.id),
  });

  if (isLoading) return <Header.Skeleton />;

  return (
    <>
      {cardData?.imageId && (
        <div className="relative w-full h-[160px] rounded-sm overflow-hidden mt-4">
          {isImageLoading && (
            <div className="absolute inset-0 transition-opacity opacity-100">
              <Header.SkeletonImage />
            </div>
          )}
          <Image
            src={`${cardData.imageFullUrl}`}
            alt="Card Cover"
            className="w-full h-full object-cover object-center"
            width={600}
            height={160}
            onLoadingComplete={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)}
          />
        </div>
      )}
      <div className="flex items-start gap-x-3 mb-6 w-full">
        <Layout className="h-5 w-5 mt-1 text-neutral-700" />
        <div className="w-full">
          <form action={onSubmit}>
            <FormInput
              id="title"
              ref={inputRef}
              onBlur={onBlur}
              defaultValue={title}
              className="font-semibold text-lg px-1 text-neutral-700 bg-transparent border-transparent relative -left-1.5 w-[95%]
            focus-visible:bg-white focus-visible:border-input mb-0.5 truncate"
            />
          </form>
          <p className="text-sm text-muted-foreground">
            in list <span className="underline">{cardData?.list.title}</span>
          </p>
        </div>
      </div>
    </>
  );
};

Header.Skeleton = function HeaderSkeleton() {
  return (
    <div className="flex items-start gap-x-3 mb-6">
      <Skeleton className="h-6 w-6 mt-1 bg-neutral-200" />
      <div className="">
        <Skeleton className="w-24 h-6 mb-1 bg-neutral-200" />
        <Skeleton className="w-12 h-4 bg-neutral-200" />
      </div>
    </div>
  );
};

Header.SkeletonImage = function ImageSkeleton() {
  return (
    <div className="w-full h-[160px] rounded-sm overflow-hidden mt-4">
      <Skeleton className="w-full h-full bg-neutral-200 animate-pulse" />
    </div>
  );
};
