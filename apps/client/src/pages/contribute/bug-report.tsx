import { Layout, LayoutBody } from '@client/components/custom/layout'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@client/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@client/components/ui/use-toast'
import { z } from 'zod'
import { Textarea } from '@client/components/ui/textarea'
import { Input } from '@client/components/ui/input'
import { Button } from '@client/components/custom/button'
import { RepositoryFactory } from '@client/api/repository-factory'
import { HttpStatusCode } from 'axios'
import { useState } from 'react'
import { IconCheck, IconCircleCheckFilled } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

const UserS = RepositoryFactory.get('user')

const bugFormSchema = z.object({
  title: z.string().min(8, 'The title must be at least 8 characters long.'),
  description: z.string().min(20, 'The description must be at least 20 characters long.'),
})

type BugFormValues = z.infer<typeof bugFormSchema>
export default function BugReport() {
  const [isSuccess, setIsSuccess] = useState(false)
  const form = useForm<BugFormValues>({
      resolver: zodResolver(bugFormSchema),
    },
  )

  async function onSubmit(data: BugFormValues) {
    const rsp = await UserS.submitBug(data)

    if (rsp.status === HttpStatusCode.Created) {
      toast({
        title: 'You have successfully submitted the issue to us. We will fix it as soon as possible.',
      })
      setIsSuccess(true)
    } else {
      toast({
        title: 'An error occurred while submitting the issue to the system.',
      })
    }
  }

  return (
    <Layout>
      <LayoutBody className={'flex flex-col space-y-4 justify-center items-center h-[100vh]'}>
        {isSuccess ?
          <div className={'flex flex-col space-y-5 items-center justify-center h-full w-full pt-16 md:pt-32'}>
            <IconCircleCheckFilled size={60} className={'text-green-600'} />
            <div className={'text-xl md:text-3xl font-semibold'}>Thank you for your contribution to us.</div>
            <Link to={'/'}>
              <Button>Go to Home</Button>
            </Link>
          </div>
          : <>
            <div className={'font-semibold lg:mt-32 xl:mt-48'}>Report a bug or request a feature</div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 min-w-[350px]">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter your description" {...field} />
                      </FormControl>
                      <FormDescription>
                        Describe the issue you encountered.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button variant={'default'} type={'submit'} className={'w-full'}>Submit</Button>
              </form>
            </Form>
          </>}

      </LayoutBody>
    </Layout>
  )
}
