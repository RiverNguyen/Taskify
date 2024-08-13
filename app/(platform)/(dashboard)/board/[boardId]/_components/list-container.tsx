"use client";

import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { ListWithCards } from "@/type";
import { ListForm } from "./list-form";
import { useEffect, useState } from "react";
import { ListItem } from "./list-item";

interface ListContainerProps {
  boardId: string;
  data: ListWithCards[];
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export const ListContainer = ({ boardId, data }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    // * Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    //* User moves a list
    if (type === "list") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index })
      );

      setOrderedData(items);
    }

    //* User moves a card
    if (type === "card") {
      let newOrderData = [...orderedData];

      //* Source and destination list
      const sourceList = newOrderData.find(
        (list) => list.id === source.droppableId
      );

      const destList = newOrderData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destList) {
        return;
      }

      //* Check if cards exist on the sourceList
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      //* Check if cards exist on the destList
      if (!destList.cards) {
        destList.cards = [];
      }

      //* Moving the card in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCard = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );

        reorderedCard.forEach((card, idx) => {
          card.order = idx;
        });

        sourceList.cards = reorderedCard;

        setOrderedData(newOrderData);

        //* Moving the card to another list
      } else {
        //* Remove the card from the source list
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        //* Assign the new listId to the moved card
        movedCard.listId = destination.droppableId;

        //* Add the card to the destination list
        destList.cards.splice(destination.index, 0, movedCard);

        sourceList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        //* Update the order for each card in the destination list
        destList.cards.forEach((card, i) => {
          card.order = i;
        });

        setOrderedData(newOrderData);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((list, index) => (
              <ListItem key={list.id} index={index} data={list} />
            ))}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};
