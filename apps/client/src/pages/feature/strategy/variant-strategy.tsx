import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@client/components/ui/form';
import { Handles, Rail, Slider, Ticks, Tracks } from 'react-compound-slider';
import { KeyboardHandle, SliderRail, Tick, Track } from '@client/components/compound-slider';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FeatureStatus } from '@abflags/shared';

const formSchema = z.object({
  name: z
    .string()
    .min(3, {message: 'Feature Key must be at least 3 characters long'})
    .max(64, {message: 'Feature Key max 25 characters long'}),
  description: z.string()
    .max(128, {message: 'Description max 128 characters long'})
    .optional(),
  status: z
    .string(),
  percentage: z.array(z.number()).min(1),
  variants: z.array(z.any())
})

export default function AddVariantStrategy() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      status: FeatureStatus.ACTIVE,
      percentage: [10, 20, 50, 80]
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="percentage"
          render={({field}) => (
            <FormItem className="space-y-1">
              <FormLabel>Percentage <span
                className={'text-red-500'}>*</span></FormLabel>
              <FormDescription>The number of feature variations will have to be fully configured on the website side, otherwise it will be hidden</FormDescription>
              <FormDescription>Variations will be scaled according to the <b>round-robin</b> algorithm</FormDescription>
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
                    {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
                  </Rail>
                  <Handles>
                    {({ handles, getHandleProps }) => (
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
                        {ticks.map(tick => (
                          <Tick key={tick.id} tick={tick}  count={1}/>
                        ))}
                      </div>
                    )}
                  </Ticks>
                </Slider>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
