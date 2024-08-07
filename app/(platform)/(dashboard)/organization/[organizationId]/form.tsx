"use client";

import { useAction } from "@/hooks/use-action";
import { FormButton } from "./form-button";
import { FormInput } from "./form-input";
import { createBoard } from "@/actions/create-board";

export const Form = () => {
  const { execute, fieldsErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      console.log(data, "Success");
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const onSubmit = (data: FormData) => {
    const title = data.get("title") as string;
    execute({ title });
  };
  return (
    <form action={onSubmit}>
      <div className="flex flex-col space-y-2">
        <FormInput errors={fieldsErrors} />
      </div>
      <FormButton />
    </form>
  );
};
