import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@client/components/ui/sheet';
import { Button } from '@client/components/custom/button';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@client/components/ui/alert';
import { IconTerminal } from '@tabler/icons-react';
import AddSimpleStrategy from '@client/pages/feature/strategy/simple-strategy';

interface AddStrategyProps {
  className?: string;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

export default function AddListStrategy({
  open,
  onOpenChange,
  className = '',
}: AddStrategyProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent style={{ maxWidth: '50vw' }}>
        <SheetHeader>
          <SheetTitle>Add Strategy</SheetTitle>
          <Alert>
            <IconTerminal className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              This feature flag is currently enabled in the development
              environment. Any changes made here will be available to users as
              soon as you hit save.
            </AlertDescription>
          </Alert>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <AddSimpleStrategy />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <div className={'inline-flex gap-3'}>
              <Button type="submit">Save changes</Button>
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
