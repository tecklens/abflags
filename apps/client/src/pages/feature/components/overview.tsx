import { Button } from '@client/components/custom/button';
import ReleaseToggle from './release-toggle';
import { IFeature } from '@abflags/shared';
import React from 'react';
import AddListStrategy from '@client/pages/feature/strategy/add-strategy';

export default function FeatureOverview({ feature }: { feature: IFeature }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pt-2">
      <ReleaseToggle feature={feature} className="lg:col-span-4" />
      <div className="p-3 shadow-lg dark:border rounded-lg lg:col-span-8">
        <div className="w-full py-16 flex justify-center">
          <Button onClick={() => setOpen(true)}>Add strategy</Button>
        </div>
      </div>

      <AddListStrategy open={open} onOpenChange={setOpen} />
    </div>
  );
}
