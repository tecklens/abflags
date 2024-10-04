import { IFeature } from "@abflags/shared";
import { formatCreatedDate } from "@client/lib/utils";
import { IconArrowsExchange, IconEdit } from "@tabler/icons-react";

interface ReleaseToggleProps {
    className?: string;
    feature: IFeature;
}

export default function ReleaseToggle(props: ReleaseToggleProps) {
    return (
        <div className={`p-3 shadow-lg dark:border rounded-lg flex flex-col gap-2 ${props.className ?? ''}`}>
            <div className="flex gap-3">
                <div>
                    <IconArrowsExchange />
                </div>
                <span className="font-semibold">Release Toggle</span>
            </div>
            <div className="flex flex-col gap-1 text-sm">
                <div className="flex justify-between w-full">
                    <span>Project:</span>
                    <span></span>
                </div>
                <div className="flex justify-between w-full">
                    <span>Lifecycle:</span>
                    <span></span>
                </div>
                <div className="flex justify-between w-full">
                    <span>Description:</span>
                    <div className="inline-flex gap-1 items-center">
                        <span>{props.feature?.description}</span>
                        <IconEdit className="cursor-pointer" size={15} />
                    </div>
                </div>
                <div className="flex justify-between w-full">
                    <span>Created at:</span>
                    <span>{formatCreatedDate(props.feature?.createdAt)}</span>
                </div>
            </div>
        </div>
    )
}