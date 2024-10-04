import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@client/components/ui/sheet';
import { Button } from '@client/components/custom/button';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@client/components/ui/alert';
import { IconTerminal } from '@tabler/icons-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@client/components/ui/tabs';
import AddSimpleStrategy from '@client/pages/feature/strategy/simple-strategy';
import AddVariantStrategy from '@client/pages/feature/strategy/variant-strategy';

interface AddStrategyProps {
  className?: string;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

export default function AddStrategy({
  open,
  onOpenChange,
  className = '',
}: AddStrategyProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent style={{ maxWidth: '50vw' }}>
        <SheetHeader>
          <SheetTitle>Add Strategy</SheetTitle>
          <SheetDescription>
            <Alert>
              <IconTerminal className="h-4 w-4" />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                This feature flag is currently enabled in the development
                environment. Any changes made here will be available to users as
                soon as you hit save.
              </AlertDescription>
            </Alert>
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <Tabs defaultValue="simple">
            <TabsList className="env-switcher grid w-full grid-cols-2">
              <TabsTrigger value="simple">Simple</TabsTrigger>
              <TabsTrigger value="variant">Variants</TabsTrigger>
            </TabsList>
            <TabsContent value={'simple'}>
              <AddSimpleStrategy />
            </TabsContent>
            <TabsContent value={'variant'}>
              <AddVariantStrategy />
            </TabsContent>
          </Tabs>
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
