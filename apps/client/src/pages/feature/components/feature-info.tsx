import { IFeature } from "@abflags/shared";
import { IconCopy, IconStar, IconTrash } from "@tabler/icons-react";
import FeatureStatusCard from "./feature-status.card";

export default function FeatureInfo({ feature }: { feature: IFeature }) {
    return (
        <div>
            <div className={'p-3 shadow-lg dark:border rounded-lg flex justify-between items-center'}>
                <div className={'flex gap-4 items-center'}>
                    <IconStar size={18} />
                    <div className="flex items-center gap-2">
                        <span className={'text-xl font-semibold'}>{feature?.name}</span>
                        <IconCopy size={18} className="pt-0.5"/>
                    </div>
                    <FeatureStatusCard status={feature.status} />
                </div>
                <div className={'flex gap-2 lg:gap-4'}>
                    <IconTrash />
                </div>
            </div>
        </div>
    )
}