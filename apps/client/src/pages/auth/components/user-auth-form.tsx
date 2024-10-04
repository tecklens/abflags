import { HTMLAttributes, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconBrandGithub } from '@tabler/icons-react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@client/components/ui/form'
import { Input } from '@client/components/ui/input'
import { Button } from '@client/components/custom/button'
import { PasswordInput } from '@client/components/custom/password-input'
import { cn, getGitHubUrl } from '@client/lib/utils'
import { IUserStore, useUser } from '@client/lib/store/userStore'
import { RepositoryFactory } from '@client/api/repository-factory'
import { HttpStatusCode } from 'axios'
import { useAuth } from '@client/context/auth'
import { throttle } from 'lodash'
import { BASE_URL } from '@client/api/base-repository'

const AuthRepository = RepositoryFactory.get('auth')
const ProjectRepository = RepositoryFactory.get('project')

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> {
}

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, {
      message: 'Please enter your password',
    })
    .min(7, {
      message: 'Password must be at least 7 characters long',
    }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useUser((state: IUserStore) => state)
  const [searchParams] = useSearchParams()
  const redirectUrl = searchParams.get('q') ?? '/'
  const token = searchParams.get('token')
  const inviteToken = searchParams.get('invite_token')
  const location = useLocation()
  const from = ((location.state as any)?.from.pathname as string) || '/profile'
  const { setToken } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    // @ts-ignore
    const rlt = await signIn({
      ...data
    })
    if (rlt) {
      // * check inviteToken for invite to organization
      if (inviteToken && inviteToken !== '') {
        setTimeout(async () => {
          try {
            const rsp = await ProjectRepository.acceptInvite(inviteToken)
            if (rsp.status === HttpStatusCode.Ok) {
              setToken(rsp.data)
            }
          } finally {
            window.location.href = redirectUrl
          }
        }, 200)
      } else {
        window.location.href = redirectUrl
      }
    }
  }

  async function checkGithubAuth() {
    const rsp = await AuthRepository.checkGithubAuth()

    if (rsp.status === HttpStatusCode.Ok) {
      window.location.href = getGitHubUrl(from, inviteToken)
    }
  }

  async function checkGoogleAuth() {
    const rsp = await AuthRepository.checkGoogleAuth()

    if (rsp.status === HttpStatusCode.Ok) {
      window.location.replace(BASE_URL + '/auth/google')
    }
  }


  const checkToken = throttle(() => {
    if (token && token.length > 0) {
      setToken(token)

      // * check inviteToken for invite to organization
      if (inviteToken && inviteToken !== '') {
        setTimeout(async () => {
          try {
            const rsp = await ProjectRepository.acceptInvite(inviteToken)
            if (rsp.status === HttpStatusCode.Ok) {
              setToken(rsp.data)
            }
          } finally {
            window.location.href = redirectUrl
          }
        }, 200)
      } else {
        window.location.href = redirectUrl
      }
    }
  }, 150)

  useEffect(() => {
    checkToken()
  }, [token, inviteToken])

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
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="tecklens" {...field} />
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
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-muted-foreground hover:opacity-75"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-2" loading={isLoading}>
              Login
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
                onClick={checkGithubAuth}
                leftSection={<IconBrandGithub className="h-4 w-4" />}
              >
                GitHub
              </Button>
              {/*<Button*/}
              {/*  variant="outline"*/}
              {/*  className="w-full"*/}
              {/*  type="button"*/}
              {/*  loading={isLoading}*/}
              {/*  onClick={checkGoogleAuth}*/}
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
