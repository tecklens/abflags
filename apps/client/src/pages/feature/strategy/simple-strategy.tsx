import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@client/components/ui/form';
import { Handles, Rail, Slider, Ticks, Tracks } from 'react-compound-slider';
import {
  KeyboardHandle,
  SliderRail,
  Tick,
  Track,
} from '@client/components/compound-slider';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FeatureStatus } from '@abflags/shared';
import { Input } from '@client/components/ui/input';
import { Switch } from '@client/components/ui/switch';
import { StrategyTargets } from '@client/pages/feature/strategy/strategy-targets';
import {useAuth} from "@client/context/auth";
import {useProject} from "@client/lib/store/projectStore";
import React, {useEffect} from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@client/components/ui/select";

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Feature Key must be at least 3 characters long' })
    .max(64, { message: 'Feature Key max 25 characters long' }),
  description: z
    .string()
    .max(128, { message: 'Description max 128 characters long' })
    .optional(),
  status: z.string(),
  percentage: z.array(z.number()).min(1),
  stickiness: z.string(),
  groupId: z.string(),
  targets: z.array(z.any()),
});

export default function AddSimpleStrategy() {
  const {token} = useAuth()
  const {variables, fetchVariables} = useProject()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      status: FeatureStatus.ACTIVE,
      percentage: [100],
      targets: [{
        operator: 'and',
        rules: [],
        groups: [],
      }]
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
  }

  useEffect(() => {
    fetchVariables({
      page: 0,
      limit: 50
    })
  }, [token])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={'grid gap-3 overflow-y-auto overflow-x-hidden px-3'}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>
                Name <span className={'text-red-500'}>*</span>
              </FormLabel>
              <FormDescription>
                What would you like to call this strategy?
              </FormDescription>
              <FormControl>
                <Input placeholder={'Strategy name'} {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <div
                  className={
                    'bg-gray-100 dark:bg-gray-900 rounded-lg p-3 flex justify-between w-full'
                  }
                >
                  <span className={'text-sm font-semibold'}>Status</span>
                  <Switch
                    checked={field.value === FeatureStatus.ACTIVE}
                    onCheckedChange={(v) => {
                      if (v) field.onChange(FeatureStatus.ACTIVE);
                      else field.onChange(FeatureStatus.INACTIVE);
                    }}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="percentage"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>
                Percentage <span className={'text-red-500'}>*</span>
              </FormLabel>
              <FormDescription>
                The number of feature variations will have to be fully
                configured on the website side, otherwise it will be hidden
              </FormDescription>
              <FormDescription>
                Variations will be scaled according to the <b>round-robin</b>{' '}
                algorithm
              </FormDescription>
              <FormControl>
                <Slider
                  vertical={false}
                  mode={3}
                  step={2}
                  domain={[0, 100]}
                  rootStyle={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: 16,
                    height: 50,
                  }}
                  onUpdate={field.onChange}
                  values={field.value}
                >
                  <Rail>
                    {({ getRailProps }) => (
                      <SliderRail getRailProps={getRailProps} />
                    )}
                  </Rail>
                  <Handles>
                    {({ handles, getHandleProps }) => (
                      <div className="slider-handles">
                        {handles.map((handle) => (
                          <KeyboardHandle
                            key={handle.id}
                            handle={handle}
                            domain={[0, 100]}
                            getHandleProps={getHandleProps}
                          />
                        ))}
                      </div>
                    )}
                  </Handles>
                  <Tracks left={false} right={false}>
                    {({ tracks, getTrackProps }) => (
                      <div className="slider-tracks">
                        {tracks.map(({ id, source, target }) => (
                          <Track
                            key={id}
                            source={source}
                            target={target}
                            getTrackProps={getTrackProps}
                          />
                        ))}
                      </div>
                    )}
                  </Tracks>
                  <Ticks count={10}>
                    {({ ticks }) => (
                      <div className="slider-ticks">
                        {ticks.map((tick) => (
                          <Tick key={tick.id} tick={tick} count={1} />
                        ))}
                      </div>
                    )}
                  </Ticks>
                </Slider>
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex gap-3 items-center">
          <FormField
            control={form.control}
            name="stickiness"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  Stickiness <span className={'text-red-500'}>*</span>
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(v) => {
                      field.onChange(v)
                    }}
                  >
                    <SelectTrigger className="py-0">
                      <SelectValue placeholder="Select a variable">
                        {variables?.data?.find(e => e._id === field.value)?.name}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select one variable</SelectLabel>
                        {variables?.data?.map((e) => (
                          <SelectItem key={e._id} value={e._id}>
                            {e.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="groupId"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  GroupId <span className={'text-red-500'}>*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder={'Group Id'} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <StrategyTargets control={form.control} register={form.register} />
      </form>
    </Form>
  );
}
