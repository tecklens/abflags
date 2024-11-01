import {useParams} from "react-router-dom";
import {useFeature} from "@client/lib/store/featureStore";
import React, {useCallback, useEffect} from "react";
import {useAuth} from "@client/context/auth";
import StrategyCard from "./strategy.card";
import {Button} from "@client/components/custom/button";
import {Card} from "@client/components/ui/card";
import AddListStrategy from "@client/pages/feature/strategy/add-strategy";
import {
  DropResult,
  DragDropContext,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot
} from "@hello-pangea/dnd";
import {reorder} from "@client/lib/utils";
import {RepositoryFactory} from "@client/api/repository-factory";
import {IFeatureStrategy} from "@abflags/shared";
import UpdateListStrategy from "@client/pages/feature/strategy/update-strategy";

export default function ListStrategy() {
  const {token} = useAuth()
  const {id} = useParams()
  const {strategies, fetchStrategies, updateOrderStrategies} = useFeature()
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [dataEditing, setDataEditing] = React.useState<any>(null);


  const fetchData = useCallback(() => {
    if (token && id) {
      fetchStrategies(id)
    }
  }, [id, token])

  function onDragStart() {
    // Add a little vibration if the browser supports it.
    // Add's a nice little physical feedback
    // if (window.navigator.vibrate) {
    //   window.navigator.vibrate(100);
    // }
  }

  function onDragEnd(result: DropResult) {
    // combining item
    if (result.combine) {
      // super simple: just removing the dragging item
      const newStrategies: IFeatureStrategy[] = [...strategies];
      newStrategies.splice(result.source.index, 1);
      updateOrderStrategies(id ?? '', newStrategies);
      return;
    }

    // dropped outside the list
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const newStrategies = reorder(
      strategies,
      result.source.index,
      result.destination.index,
    );

    updateOrderStrategies(id ?? '', newStrategies);
  }

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <>
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div>
          <Droppable
            droppableId={'strategy-feature'}
            // ignoreContainerClipping={ignoreContainerClipping}
            // isDropDisabled={isDropDisabled}
            // isCombineEnabled={isCombineEnabled}
            // renderClone={
            //   (provided, snapshot, descriptor) => (
            //     <StrategyCard
            //       onReload={fetchData} strategy={s} key={s._id}
            //     />
            //   )
            // }
          >
            {(
              dropProvided: DroppableProvided,
            ) => (
              <div>
                <div className={'overflow-x-hidden overflow-y-auto max-h-[100vh]'}>
                  <div ref={dropProvided.innerRef} className={'flex flex-col gap-3'}>
                    {strategies.map((s, index) => {
                      return <Draggable key={s._id} draggableId={s._id} index={index}>
                        {(
                          dragProvided: DraggableProvided,
                          dragSnapshot: DraggableStateSnapshot,
                        ) => (
                          <StrategyCard
                            key={s._id}
                            onReload={fetchData}
                            onEdit={() => {
                              setEditing(true)
                              setDataEditing(s)
                            }}
                            strategy={s}
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            isDragging={dragSnapshot.isDragging}
                          />
                        )}
                      </Draggable>
                    })}
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </div>
        {/*{strategies.map(s => <StrategyCard onReload={fetchData} strategy={s} key={s._id}/>)}*/}
      </DragDropContext>

      <Card className="p-3 shadow-lg dark:border rounded-lg">
        <div className="w-full py-16 flex justify-center">
          <Button onClick={() => setOpen(true)}>Add strategy</Button>
        </div>
      </Card>
      <AddListStrategy onReload={fetchData} open={open} onOpenChange={setOpen}/>
      <UpdateListStrategy data={dataEditing} onReload={fetchData} open={editing} onOpenChange={setEditing}/>
    </>
  )
}


