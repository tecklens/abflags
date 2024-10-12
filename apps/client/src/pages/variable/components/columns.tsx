import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { IVariable } from '@abflags/shared';
import { IconCheck, IconMinus } from '@tabler/icons-react';

export const columns: ColumnDef<IVariable>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[120px] tracking-wide">{row.getValue('name')}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue('type')}</div>;
    },
  },
  {
    accessorKey: 'defaultValue',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Default Value" />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue('type')}</div>;
    },
  },
  {
    accessorKey: 'required',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Required" />
    ),
    cell: ({ row }) => {
      return (
        <div>{row.getValue('required') ? <IconCheck size={18} className={'text-primary'} /> : <IconMinus size={18} />}</div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
