import {ColumnDef} from '@tanstack/react-table'
import {DataTableColumnHeader} from './data-table-column-header'
import {DataTableRowActions} from './data-table-row-actions'
import {format} from 'date-fns'
import {FeatureStatus, IFeature} from "@abflags/shared";
import {Switch} from "@client/components/ui/switch";

export const columns: ColumnDef<IFeature>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Feature Key' />
    ),
    cell: ({ row }) => <div className='w-[120px] tracking-wide'>{row.getValue('name')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.type)?

      return (
        <div>{format(row.getValue('createdAt'), "yyyy-MM-dd HH:mm:ss")}</div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      return (
        <Switch checked={row.getValue('status') === FeatureStatus.ACTIVE}/>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
