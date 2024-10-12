import FeatureType from './feature-type';
import {IFeature} from '@abflags/shared';
import React from 'react';
import ListStrategy from "@client/pages/feature/strategy/list-strategy";

export default function FeatureOverview({feature}: { feature: IFeature }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pt-2">
      <FeatureType feature={feature} className="lg:col-span-4"/>
      <div className={'lg:col-span-8 grid grid-cols-1 gap-3'}>
        <ListStrategy/>
      </div>
    </div>
  );
}
