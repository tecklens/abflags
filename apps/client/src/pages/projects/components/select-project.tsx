import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@client/components/ui/dialog";
import {Input} from "@client/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@client/components/ui/select";
import {IconAdjustmentsHorizontal, IconSortAscendingLetters, IconSortDescendingLetters} from "@tabler/icons-react";
import {Separator} from "@client/components/ui/separator";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useProject} from "@client/lib/store/projectStore";
import {IProject} from "@abflags/shared";
import {Button} from "@client/components/custom/button";

export default function SelectProject() {
  const navigate = useNavigate()
  const {projects, fetchProjects, openSelectProject, setOpenSelectProject} = useProject()
  const [sort, setSort] = useState('ascending')
  const [appType, setAppType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (openSelectProject)
      fetchProjects()
  }, [openSelectProject])

  return (
    <Dialog open={openSelectProject} onOpenChange={setOpenSelectProject}>
      <DialogHeader>
      </DialogHeader>
      <DialogContent className={'max-w-screen-lg max-h-[90vh]'}>
        <DialogTitle>Select Project</DialogTitle>
        {/* ===== Content ===== */}
        <div className="flex flex-col">
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
                <SelectItem value="ascending">
                  <div className="flex items-center gap-4">
                    <IconSortAscendingLetters size={16}/>
                    <span>Ascending</span>
                  </div>
                </SelectItem>
                <SelectItem value="descending">
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
              <li
                key={app._id}
                className="rounded-lg border p-4 hover:shadow-md"
              >
                <div className="mb-8 flex items-center justify-between">
                  <div
                    className={`flex size-10 items-center justify-center rounded-lg bg-muted p-2`}
                  >
                  </div>
                  {/*<Button*/}
                  {/*  onClick={() => navigate(`/provider?open_provider=${app.id}`)}*/}
                  {/*  variant="outline"*/}
                  {/*  size="sm"*/}
                  {/*  className={`${app.connected ? 'border border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900' : ''}`}*/}
                  {/*>*/}
                  {/*  {app.connected ? 'Connected' : 'Connect'}*/}
                  {/*</Button>*/}
                </div>
                <div>
                  <h2 className="mb-1 font-semibold">{app.name}</h2>
                  {/*<p className="line-clamp-2 text-gray-500">{app.desc}</p>*/}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}
