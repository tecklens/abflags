import {IconMoodEmpty} from "@tabler/icons-react";

export default function Empty({className = '', title}: {className?: string, title?: string}) {
  return (
    <div className={`w-full py-6 md:py-16 flex flex-col justify-center items-center text-gray-300 dark:text-gray-60 gap-3 ${className}`}>
      <IconMoodEmpty size={58}/>
      <div className={'text-xl md:text-3xl font-semibold'}>{title ?? 'No data'}</div>
    </div>
  )
}
