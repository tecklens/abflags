import {DotsHorizontalIcon} from '@radix-ui/react-icons'
import {Row} from '@tanstack/react-table'

import {Button} from '@client/components/custom/button'
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger,} from '@client/components/ui/dropdown-menu'


interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

// @ts-ignore
export function DataTableRowActions<TData>({
                                             row,
                                           }: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
