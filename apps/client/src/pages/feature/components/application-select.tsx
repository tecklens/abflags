import * as React from 'react'
import {useEffect, useState} from 'react'
import {CheckIcon, PlusCircledIcon} from '@radix-ui/react-icons'

import {cn} from '@client/lib/utils'
import {Badge} from '@client/components/ui/badge'
import {Button} from '@client/components/custom/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@client/components/ui/command'
import {Popover, PopoverContent, PopoverTrigger,} from '@client/components/ui/popover'
import {Separator} from '@client/components/ui/separator'
import {useApp} from "@client/lib/store/appStore";

interface ApplicationSelectProps<TData, TValue> {
  title?: string
}

export function ApplicationSelect<TData, TValue>({
  title,
}: ApplicationSelectProps<TData, TValue>) {
  const {apps, fetchAllApp} = useApp()
  const [selectedValues, setSelectedValues] = useState<string[]>([])

  useEffect(() => {
    fetchAllApp()
  }, [])

  useEffect(() => {
    if (apps) setSelectedValues(apps.map(e => e.appName))
  }, [apps])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='h-8 border-dashed'>
          <PlusCircledIcon className='mr-2 h-4 w-4' />
          {title}
          {selectedValues?.length > 0 && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <Badge
                variant='secondary'
                className='rounded-sm px-1 font-normal lg:hidden'
              >
                {selectedValues.length}
              </Badge>
              <div className='hidden space-x-1 lg:flex'>
                {selectedValues.length > 2 ? (
                  <Badge
                    variant='secondary'
                    className='rounded-sm px-1 font-normal'
                  >
                    {selectedValues.length} selected
                  </Badge>
                ) : (
                  apps?.filter((option) => selectedValues.includes(option.appName))
                    .map((option) => (
                      <Badge
                        variant='secondary'
                        key={option.appName}
                        className='rounded-sm px-1 font-normal'
                      >
                        {option.appName}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0' align='start'>
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {apps?.map((option) => {
                const isSelected = selectedValues.includes(option.appName)
                return (
                  <CommandItem
                    key={option.appName}
                    onSelect={() => {
                      if (isSelected) {
                        setSelectedValues(selectedValues.filter(s => s !== option.appName))
                      } else {
                        setSelectedValues([...selectedValues, option.appName])
                      }
                    }}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <CheckIcon className={cn('h-4 w-4')} />
                    </div>
                    <span>{option.appName}</span>
                    {selectedValues.includes(option.appName) && (
                      <span className='ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs'>
                        {selectedValues.includes(option.appName)}
                      </span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => setSelectedValues([])}
                    className='justify-center text-center'
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
