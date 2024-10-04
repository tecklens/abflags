import { Input } from '@client/components/ui/input'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@client/components/ui/command'
import {
  IconComponents,
  IconCreditCard,
  IconHierarchy2,
  IconLayoutDashboard,
  IconPlus,
  IconSettings,
  IconUser,
} from '@tabler/icons-react'
import React from 'react'
import { throttle } from 'lodash'
import { useNavigate } from 'react-router-dom'

export function Search() {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate();

  const onRoute = throttle((link: string) => {
    navigate(link)
  }, 200)
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <div>
      <Input
        type='search'
        placeholder='Search (Ctrl J)...'
        className='md:w-[100px] lg:w-[300px]'
        onClick={() => setOpen(true)}
      />

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => onRoute('/workflow')}>
              <IconHierarchy2 className="mr-2 h-4 w-4" />
              <span className={'font-semibold'}>Go to Workflow</span>
            </CommandItem>
            <CommandItem onSelect={() => onRoute('/workflow?openCreate=true')}>
              <IconPlus className="mr-2 h-4 w-4" />
              <span>Create Workflow</span>
            </CommandItem>
            <CommandItem onSelect={() => onRoute('/')}>
              <IconLayoutDashboard className="mr-2 h-4 w-4" />
              <span>Go to Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => onRoute('/provider')}>
              <IconComponents className="mr-2 h-4 w-4" />
              <span>Go to Provider</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Environments">
            <CommandItem onSelect={() => onRoute('/settings/keys')}>
              <IconUser className="mr-2 h-4 w-4" />
              <span>Go to API key</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem onSelect={() => onRoute('/settings')}>
              <IconUser className="mr-2 h-4 w-4" />
              <span>Go to Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => onRoute('/settings/billing')}>
              <IconCreditCard className="mr-2 h-4 w-4" />
              <span className={'font-semibold'}>Go to Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem  onSelect={() => onRoute('/settings')}>
              <IconSettings className="mr-2 h-4 w-4" />
              <span>Go to Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  )
}
