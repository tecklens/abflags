import { HTMLAttributes, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconBrandGithub } from '@tabler/icons-react'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@client/components/ui/form'
import { Input } from '@client/components/ui/input'
import { Button } from '@client/components/custom/button'
import { PasswordInput } from '@client/components/custom/password-input'
import { cn } from '@client/lib/utils'
import { RepositoryFactory } from '@client/api/repository-factory'
import { useToast } from '@client/components/ui/use-toast'
import { AxiosResponse, HttpStatusCode } from 'axios'
import { useAuth } from '@client/context/auth'
import { useSearchParams } from 'react-router-dom'

const AuthRepository = RepositoryFactory.get('auth')
const ProjectRepository = RepositoryFactory.get('project')

interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {
}

const formSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: 'Please enter your email' })
      .email({ message: 'Invalid email address' }),
    firstName: z.string().min(1, { message: 'Please enter your name' }),
    password: z
      .string()
      .min(1, {
        message: 'Please enter your password',
      })
      .min(6, {
        message: 'Password must be at least 64 characters long',
      })
      .max(64, {
        message: 'Maximum password length is 64',
      }),
    confirmPassword: z.string(),
    projectName: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords don\'t match.',
    path: ['confirmPassword'],
  })

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { setToken } = useAuth()
  const [searchParams] = useSearchParams()
  const inviteToken = searchParams.get('invite_token')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      firstName: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const rsp: AxiosResponse = await AuthRepository.register(data)

      if (rsp.status === HttpStatusCode.Created) {
        setToken(rsp.data.token)

        // * check inviteToken for invite to organization
        if (inviteToken && inviteToken !== '') {
          setTimeout(async () => {
            try {
              const rsp = await ProjectRepository.acceptInvite(inviteToken)
              if (rsp.status === HttpStatusCode.Ok) {
                setToken(rsp.data)
              }
            } finally {
              window.location.href = '/'
            }
          }, 200)
        } else {
          window.location.href = '/'
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Register failed',
        })
      }
    } catch (e: any) {
      console.log(e)
      toast({
        variant: 'destructive',
        title: e.response?.data?.message,
      })
    } finally {
      setIsLoading(false)

    }

  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Johnson" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Organization Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-2" loading={isLoading}>
              Create Account
            </Button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="w-full"
                type="button"
                loading={isLoading}
                leftSection={<IconBrandGithub className="h-4 w-4" />}
              >
                GitHub
              </Button>
              {/*<Button*/}
              {/*  variant="outline"*/}
              {/*  className="w-full"*/}
              {/*  type="button"*/}
              {/*  loading={isLoading}*/}
              {/*  leftSection={<IconBrandGoogle className="h-4 w-4" />}*/}
              {/*>*/}
              {/*  Google*/}
              {/*</Button>*/}
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
