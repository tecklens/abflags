import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@client/components/ui/sheet';
import {Button} from '@client/components/custom/button';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@client/components/ui/alert';
import {IconTerminal} from '@tabler/icons-react';
import AddSimpleStrategy from '@client/pages/feature/strategy/simple-strategy';

interface UpdateStrategyProps {
  className?: string;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onReload: () => void,
  data: any;
}

export default function UpdateListStrategy({
                                             open,
                                             onOpenChange,
                                             className = '',
                                             onReload,
                                             data,
                                           }: UpdateStrategyProps) {
  return (
    <Sheet open={open && data} onOpenChange={onOpenChange}>
      <SheetContent className={'overflow-y-auto !max-w-[100vw] lg:!max-w-[50vw]'}>
        <SheetHeader>
          <SheetTitle>Update Strategy <span>{data?.name}</span></SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <AddSimpleStrategy data={data} onReload={onReload}/>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <div className={'inline-flex gap-3'}>
              <Button form={'add-strategy-form'} type="submit">Save changes</Button>
              <Button type="button" variant={'outline'}>
                Cancel
              </Button>
            </div>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
