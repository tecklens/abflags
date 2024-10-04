import { Separator } from '@client/components/ui/separator'
import { useUser } from '@client/lib/store/userStore'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@client/components/ui/form'
import { PasswordInput } from '@client/components/custom/password-input'
import { Button } from '@client/components/custom/button'
import { useState } from 'react'
import { RepositoryFactory } from '@client/api/repository-factory'
import { HttpStatusCode } from 'axios'
import { useToast } from '@client/components/ui/use-toast'

const UserRepository = RepositoryFactory.get('user')

const formSchema = z.object({
  password: z
    .string()
    .min(1, {
      message: 'Please enter your password',
    })
    .min(7, {
      message: 'Password must be at least 7 characters long',
    })
    .max(64, {
      message: 'Maximum password length is 64',
    }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords don\'t match.',
  path: ['confirmPassword'],
})

export default function SettingsPasswordStep2() {
  const params= useParams()
  const { user } = useUser()
  const {toast} = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const rsp = await UserRepository.changePassword({
        ...data,
        changePasswordTransactionId: params?.txId
      })

      if (rsp.status === HttpStatusCode.Created) {
        localStorage.clear()
        navigate('/sign-in')
      } else {
        toast({
          variant: 'destructive',
          content: 'An error occurred while changing the password.'
        })
      }
    } catch (e: any) {
      toast({
        variant: 'destructive',
        content: e?.response?.data?.message ?? 'An error occurred while changing the password.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Change Password</h3>
        <p className="text-sm text-muted-foreground">
          The password reset link will be sent to your email <Link to={'https://gmail.com'}
                                                                   className={'underline'}>{user?.email}</Link>.
        </p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="mt-4" loading={isLoading}>
            Change Password
          </Button>
        </form>
      </Form>
    </div>
  )
}
