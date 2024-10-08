import {ColumnDef} from '@tanstack/react-table'
import {DataTableColumnHeader} from './data-table-column-header'
import {DataTableRowActions} from './data-table-row-actions'
import {format} from 'date-fns'
import {IFeature} from "@abflags/shared";
import FeatureStatusCard from "../../../components/feature-status.card";

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
        <FeatureStatusCard status={row.getValue('status')} />
      )
    },
    enableColumnFilter: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
