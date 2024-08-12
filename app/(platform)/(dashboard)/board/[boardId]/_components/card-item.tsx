"use client";

import { Card } from "@prisma/client";

interface CardItemProp {
  data: Card;
  index: number;
}

export const CardItem = ({ data, index }: CardItemProp) => {
  return (
    <div
      role="button"
      className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm transition duration-200"
    >
      {data.title}
    </div>
  );
};
