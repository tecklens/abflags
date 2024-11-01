import {useFeature} from "@client/lib/store/featureStore";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@client/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@client/components/ui/form";
import {Input} from "@client/components/ui/input";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {FeatureBehavior, FeatureStatus, FeatureType} from "@abflags/shared";
import {Switch} from "@client/components/ui/switch";
import {Tag, TagInput} from "emblor";
import React, {useState} from "react";
import {RadioGroup, RadioGroupItem} from "@client/components/ui/radio-group";
import {Label} from "@client/components/ui/label";
import {Button} from "@client/components/custom/button";
import {Handles, Rail, Slider, Ticks, Tracks} from "react-compound-slider";
import {KeyboardHandle, SliderRail, Tick, Track} from "@client/components/compound-slider";
import {RepositoryFactory} from "@client/api/repository-factory";
import axios, {AxiosResponse, HttpStatusCode} from "axios";
import {useToast} from "@client/components/ui/use-toast";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@client/components/ui/select";
import {FEATURE_TYPES} from "@client/pages/feature/components/feature-types";

const FeatureRepository = RepositoryFactory.get('feature')

const formSchema = z.object({
  name: z
    .string()
    .min(3, {message: 'Feature Key must be at least 3 characters long'})
    .max(64, {message: 'Feature Key max 25 characters long'})
    .refine(
      (value) => /^[a-zA-Z][a-zA-Z0-9]*?[a-zA-Z0-9]$/.test(value ?? ""),
      'Feature Key should contain only alphabets, _'),
  description: z.string()
    .max(128, {message: 'Description max 128 characters long'})
    .optional(),
  status: z
    .string(),
  tags: z.array(z.object({
    id: z.string(),
    text: z.string(),
  }),).max(4, {message: 'Max 4 tags'}).optional(),
  behavior: z.string(),
  percentage: z.array(z.number()).min(1),
  type: z.string()
})

const LIST_BEHAVIOR = [
  {
    id: FeatureBehavior.SIMPLE,
    label: 'Simple',
    description: 'All users get the same value'
  },
  {
    id: FeatureBehavior.TARGET,
    label: 'Targeted',
    description: 'Most users get one value, a targeted segment gets another'
  },
  {
    id: FeatureBehavior.PERCENTAGE_ROLLOUT,
    label: 'Percentage Rollout',
    description: 'Gradually release a value to users while everyone else gets a fallback'
  },
  {
    id: FeatureBehavior.A_B_EXPERIMENT,
    label: 'A/B Experiment',
    description: 'Run an A/B test between multiple values.'
  }
]

export default function NewFeature() {
  const {toast} = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const {openNewFeature, setOpenNewFeature} = useFeature()
  const [tags, setTags] = useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      status: FeatureStatus.ACTIVE,
      behavior: FeatureBehavior.SIMPLE,
      tags: [],
      percentage: [10, 20, 50, 80],
      type: FeatureType.RELEASE,
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (isLoading) return
    setIsLoading(true)
    FeatureRepository.create(data).then((resp: AxiosResponse) => {
      if (resp.status === HttpStatusCode.Created) {
        toast({
          title: 'Create feature successful',
        })
        setOpenNewFeature(false)
      } else {
        toast({
          title: 'Create feature failed',
          variant: 'destructive'
        })
      }
    })
      .catch((e: any) => {
        if (axios.isAxiosError(e)) {
          toast({
            title: e.response?.data?.message,
            variant: 'destructive'
          })
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <Dialog open={openNewFeature} onOpenChange={setOpenNewFeature}>
      <DialogHeader></DialogHeader>
      <DialogContent className={'max-w-screen-lg max-h-[90vh]'}>
        <DialogTitle>Create Feature</DialogTitle>
        <Form {...form}>
          <form id={'create-feature'} onSubmit={form.handleSubmit(onSubmit)} className={'w-full'}>
            <div className="grid gap-3 w-full overflow-y-auto overflow-x-hidden px-2">
              <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Feature Key <span
                      className={'text-red-500'}>*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: login. register,..." {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({field}) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({field}) => (
                  <FormItem className="">
                    <FormLabel>
                      Feature Type <span className={'text-red-500'}>*</span>
                    </FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className='h-8 w-full'>
                          <SelectValue>
                            <div className={'inline-flex items-center gap-1'}>
                              {FEATURE_TYPES.find(e => e.id === field.value)?.icon}
                              <span>{FEATURE_TYPES.find(e => e.id === field.value)?.label}</span>
                            </div>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {FEATURE_TYPES.map(e => (
                            <SelectItem value={e.id} key={e.id}>
                              <div className={'inline-flex items-center gap-1'}>
                                {e.icon}
                                <span>{' '}{e.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({field}) => (
                  <FormItem className="space-y-1 flex flex-col">
                    <FormLabel>Status <span
                      className={'text-red-500'}>*</span></FormLabel>
                    <FormControl>
                      <Switch checked={field.value === FeatureStatus.ACTIVE} onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange(FeatureStatus.ACTIVE)
                        } else {
                          field.onChange(FeatureStatus.INACTIVE)
                        }
                      }}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({field}) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <TagInput
                        {...field}
                        maxTags={4}
                        activeTagIndex={activeTagIndex}
                        setActiveTagIndex={setActiveTagIndex}
                        placeholder="Enter a tag"
                        tags={tags}
                        className="w-full"
                        setTags={(newTags) => {
                          setTags(newTags);
                          form.setValue('tags', newTags as [Tag, ...Tag[]]);
                        }}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="behavior"
                render={({field}) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Behavior (can change later) <span
                      className={'text-red-500'}>*</span></FormLabel>
                    <FormControl>
                      <RadioGroup
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        {LIST_BEHAVIOR.map(({id, description, label}) => (
                          <div className="flex items-center space-x-2" key={id}>
                            <RadioGroupItem value={id} id={id}
                                            checked={field.value === id}/>
                            <Label htmlFor={id} className={'grid grid-cols-12 w-full'}>
                              <span className={'col-span-4'}>{label}</span>
                              <span className={'col-span-8'}>{description}</span>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="percentage"
                render={({field}) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Percentage <span
                      className={'text-red-500'}>*</span></FormLabel>
                    <FormDescription>The number of feature variations will have to be fully configured on the website
                      side, otherwise it will be hidden</FormDescription>
                    {/*<FormDescription>Variations will be scaled according to*/}
                    {/*  the <b>round-robin</b> algorithm</FormDescription>*/}
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
                          height: 50
                        }}
                        onUpdate={field.onChange}
                        values={field.value}
                      >
                        <Rail>
                          {({getRailProps}) => <SliderRail getRailProps={getRailProps}/>}
                        </Rail>
                        <Handles>
                          {({handles, getHandleProps}) => (
                            <div className="slider-handles">
                              {handles.map(handle => (
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
                          {({tracks, getTrackProps}) => (
                            <div className="slider-tracks">
                              {tracks.map(({id, source, target}) => (
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
                          {({ticks}) => (
                            <div className="slider-ticks">
                              {ticks.map(tick => (
                                <Tick key={tick.id} tick={tick} count={1}/>
                              ))}
                            </div>
                          )}
                        </Ticks>
                      </Slider>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type={'submit'} form={'create-feature'}>Create</Button>
          <Button variant={'outline'} type={'button'} onClick={() => setOpenNewFeature(false)}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
