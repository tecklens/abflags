import { FeatureStatus } from "@abflags/shared";
import {Badge} from "@client/components/ui/badge";

export default function FeatureStatusCard({status}: { status: string }) {
    const listStatus = {
        [FeatureStatus.INACTIVE]:
            {
                color: '#E03C31',
                bg: '#FFECEB',
                label: 'Không hoạt động'
            },
        [FeatureStatus.ACTIVE]:
            {
                color: '#07A35D',
                bg: '#E7FFF4',
                label: 'Hoạt động'
            },
    }

    // @ts-ignore
    const s = listStatus[status]

    return (
        <div>
            <Badge className={'whitespace-nowrap text-xs md:text-sm px-2 py-0'} style={{backgroundColor: s.bg, color: s.color}} color={s.color}>{s.label}</Badge>
        </div>
    )
}