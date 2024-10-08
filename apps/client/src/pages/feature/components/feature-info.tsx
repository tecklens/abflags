import {IFeature} from "@abflags/shared";
import {IconCopy, IconStar, IconTrash} from "@tabler/icons-react";
import FeatureStatusCard from "../../../components/feature-status.card";
import {useToast} from "@client/components/ui/use-toast";
import copy from "copy-to-clipboard";
import {Button} from "@client/components/custom/button";

export default function FeatureInfo({feature}: { feature: IFeature }) {
  const {toast} = useToast()

  const onCopyToClipboard = (url: string) => {
    copy(url);
    toast({
      title: 'Copied to clipboard',
    });
  };

  return (
    <div>
      <div className={'p-3 shadow-lg dark:border rounded-lg flex justify-between items-center'}>
        <div className={'flex gap-4 items-center'}>
          <IconStar size={18}/>
          <div className="flex items-center gap-2">
            <span className={'text-xl font-semibold pb-1'}>{feature?.name}</span>
            <Button variant={'ghost'} size={'icon'}
                    className={'h-6 w-6'}
                    onClick={() => onCopyToClipboard(feature?.name ?? '')}
            >
              <IconCopy size={16} className=""/>
            </Button>
          </div>
          <FeatureStatusCard status={feature.status}/>
        </div>
        <div className={'flex gap-2 lg:gap-4'}>
          <IconTrash/>
        </div>
      </div>
    </div>
  )
}
