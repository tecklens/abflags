import {useProject} from "@client/lib/store/projectStore";
import {IconEdit, IconTrash} from "@tabler/icons-react";

export default function ProjectInfo() {
  const {activeProject} = useProject()

  return (
    <div className={'p-3 shadow-lg dark:border rounded-lg flex justify-between items-center'}>
      <div className={'flex flex-col gap-2'}>
        <span className={'text-xl font-bold'}>{activeProject?.name}</span>
        <div className={'text-sm'}>
          <span className={'font-semibold'}>Description: {' '}</span>
          <span>{activeProject?.description}</span>
        </div>
      </div>
      <div className={'flex gap-2 lg:gap-4'}>
        <div className={'font-semibold'}>
          {activeProject?.numMembers} members
        </div>
        <IconEdit />
        <IconTrash />
      </div>
    </div>
  )
}
