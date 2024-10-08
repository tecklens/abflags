import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@client/components/ui/dialog";
import {Input} from "@client/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@client/components/ui/select";
import {
  IconActivityHeartbeat,
  IconAdjustmentsHorizontal,
  IconHeartbeat, IconMinus,
  IconSortAscendingLetters,
  IconSortDescendingLetters, IconStar
} from "@tabler/icons-react";
import {Separator} from "@client/components/ui/separator";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useProject} from "@client/lib/store/projectStore";
import {IProject} from "@abflags/shared";
import {Button} from "@client/components/custom/button";
import {getDateDistance} from "@client/lib/utils";
import {Avatar, AvatarFallback, AvatarImage} from "@client/components/ui/avatar";
import {throttle} from "lodash";
import {useUser} from "@client/lib/store/userStore";

export default function SelectProject() {
  const {projects, fetchProjects, openSelectProject, setOpenSelectProject} = useProject()
  const [sort, setSort] = useState('ASC')
  const [searchTerm, setSearchTerm] = useState('')

  const fetchData = throttle(() => {
    fetchProjects({
      name: searchTerm,
      sortType: sort
    })
  }, 3000, {trailing: true})

  useEffect(() => {
    if (openSelectProject)
      fetchData()
  }, [openSelectProject, searchTerm, sort])

  return (
    <Dialog open={openSelectProject} onOpenChange={setOpenSelectProject}>
      <DialogHeader>
      </DialogHeader>
      <DialogContent className={'max-w-screen-lg max-h-[90vh]'}>
        <DialogTitle>Select Project</DialogTitle>
        {/* ===== Content ===== */}
        <div className="flex flex-col w-full overflow-y-auto">
          <div className="my-4 flex items-end justify-between sm:my-0 sm:items-center">
            <div className="flex flex-col gap-4 sm:my-4 sm:flex-row">
              <Input
                placeholder="Filter apps..."
                className="h-9 w-40 lg:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Link to={'/project/create'}>
                <Button variant={'outline'} onClick={() => setOpenSelectProject(false)}>New project</Button>
              </Link>
            </div>

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-16">
                <SelectValue>
                  <IconAdjustmentsHorizontal size={18}/>
                </SelectValue>
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="ASC">
                  <div className="flex items-center gap-4">
                    <IconSortAscendingLetters size={16}/>
                    <span>Ascending</span>
                  </div>
                </SelectItem>
                <SelectItem value="DESC">
                  <div className="flex items-center gap-4">
                    <IconSortDescendingLetters size={16}/>
                    <span>Descending</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator className="shadow"/>
          <ul className="overflow-y-auto grid gap-4 pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((app: IProject) => (
              <ProjectCard app={app} key={app._id}/>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const ProjectCard = ({app}: { app: IProject }) => {
  const {switchProject} = useUser()
  const {setOpenSelectProject} = useProject()
  const selectProject = (project: IProject) => {
    switchProject(project._id)
    setOpenSelectProject(false)
  }
  return (<li
    key={app._id}
    className="rounded-lg border hover:shadow-md cursor-pointer"
    onClick={() => selectProject(app)}
  >
    <div className="p-3 flex items-center justify-between gap-2">
      <div
        className={`flex size-10 items-center justify-center rounded-lg bg-muted p-2`}
      >
        <IconHeartbeat className={'text-purple-600'}/>
      </div>
      <div className={'flex-1 flex flex-col'}>
        <div className="font-semibold">{app.name}</div>
        <p className="line-clamp-1 text-xs text-gray-500">Updated {getDateDistance(app.updatedAt)}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className={``}
      >
        <IconStar size={18}/>
      </Button>
    </div>
    <div className={'w-full px-3 py-2 inline-flex justify-between text-xs items-center'}>
      <div className={'flex flex-col'}>
        <span><span className={'font-semibold'}>1</span> flag</span>
        <span><span className={'font-semibold'}>100%</span> health</span>
      </div>

      {/*<div className={'inline-flex gap-1 md:gap-2 items-center'}>*/}
      {/*  <Button size={'icon'} variant={'secondary'} className={'h-6 w-6'}>*/}
      {/*    <IconMinus size={15}/>*/}
      {/*  </Button>*/}
      {/*  <span className={'text-gray-600 dark:text-gray-300'}>No activity</span>*/}
      {/*</div>*/}
      <div className={'inline-flex gap-1 md:gap-2 items-center'}>
        <Button size={'icon'} variant={'secondary'} className={'h-6 w-6'}>
          <IconActivityHeartbeat className={'text-purple-600'} size={15}/>
        </Button>
        <span className={'text-gray-600 dark:text-gray-300'}>{getDateDistance(app.updatedAt)}</span>
      </div>
    </div>
    <Separator/>
    <div className={'px-3 py-2 flex gap-2 items-center'}>
      <div>
        <Avatar className="h-8 w-8">
          <AvatarImage src={app?.owner?.profilePicture ?? ''} alt="@abflags"/>
          <AvatarFallback className={'text-sm'}>AB</AvatarFallback>
        </Avatar>
      </div>
      <div className={'flex flex-col flex-1'}>
        <span>{app?.owner?.firstName}</span>
        <span
          className={'text-xs text-gray-600 dark:text-gray-300 line-clamp-1 overflow-ellipsis overflow-hidden'}>{app?.owner?.email}</span>
      </div>
      <div className={'text-xs'}>1 member</div>
    </div>
  </li>)
}
