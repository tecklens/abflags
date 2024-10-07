import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';

import { Button } from '@client/components/custom/button';
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger,
} from '@client/components/ui/dropdown-menu';
import {RepositoryFactory} from "@client/api/repository-factory";
import {AxiosResponse, HttpStatusCode} from "axios";
import {useState} from "react";
import {useToast} from "@client/components/ui/use-toast";
import {get} from "lodash";

const FeatureRepository = RepositoryFactory.get('feature')

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

// @ts-ignore
export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isLoading, setIsLoading] = useState(false)
  const {toast} = useToast()
  const archive = (e: any) => {
    e.stopPropagation()
    setIsLoading(true)
    FeatureRepository.archive(get(row.original, '_id'))
      .then((resp: AxiosResponse) => {
        if (resp.status === HttpStatusCode.Ok) {
          toast({
            title: 'Archive features successfully.'
          })
        }
      })
      .catch((e: any) => {
        toast({
          variant: 'destructive',
          title: 'An error occurred while archiving the feature.'
        })
      })
      .finally(() => setIsLoading(false))
  }

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
      <DropdownMenuContent
        align="end"
        className="w-[160px]"
      >
        <DropdownMenuItem onClick={archive}>Archive</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
