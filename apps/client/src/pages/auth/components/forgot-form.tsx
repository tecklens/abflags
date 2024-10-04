import { HTMLAttributes, useState } from 'react'
import { cn } from '@client/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@client/components/custom/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@client/components/ui/form'
import { Input } from '@client/components/ui/input'
import { RepositoryFactory } from '@client/api/repository-factory'
import { AxiosResponse } from 'axios'
import { useToast } from '@client/components/ui/use-toast'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@client/components/ui/input-otp'
import { PasswordInput } from '@client/components/custom/password-input'
import { useAuth } from '@client/context/auth'

const AuthRepository = RepositoryFactory.get('auth')


interface ForgotFormProps extends HTMLAttributes<HTMLDivElement> {
}

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  otp: z
    .string()
    .min(6, { message: 'OTP has a minimum length of 6' }),
  password: z
    .string()
    .min(1, {
      message: 'Please enter your password',
    })
    .min(7, {
      message: 'Password must be at least 7 characters long',
    }),
})

export function ForgotForm({ className, ...props }: ForgotFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const {setToken} = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', otp: '' },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    AuthRepository.forgotPass({
      password: data.password,
      otp: data.otp,
    }).then((d: AxiosResponse) => {
      if (d.data?.token) {
        setToken(d.data?.token)
        window.location.href = '/'
      } else {
        toast({
          title: 'An error occurred when submitting a forgotten password request',
          variant: 'destructive',
        })
      }
    }).finally(() => {
      setIsLoading(false)
    })
  }

  function sendEmail() {
    setIsLoading(true)

    AuthRepository.sendEmailResetPass({
      email: form.getValues().email,
    }).then((d: AxiosResponse) => {
      if (d.data?.success) {
        setStep(2)
      } else {
        toast({
          title: 'An error occurred when submitting a forgotten password request',
          variant: 'destructive',
        })
      }
    }).finally(() => {
      setIsLoading(false)
    })
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
                <FormItem className={`space-y-1 ${step === 1 ? 'block' : 'hidden'}`}>
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
              name="otp"
              render={({ field }) => (
                <FormItem className={`space-y-1 justify-center ${step === 2 ? 'flex' : 'hidden'}`}>
                  <FormControl className={'flex w-fit justify-center'}>
                    <InputOTP {...field} maxLength={6}
                              className={`space-y-1 flex w-fit`}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className={`space-y-1 ${step === 2 ? 'block' : 'hidden'}`}>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className={`mt-2 ${step === 1 ? 'block' : 'hidden'}`} type={'button'} loading={isLoading} onClick={sendEmail}>
              Send OTP
            </Button>
            <Button className={`mt-2 ${step === 2 ? 'block' : 'hidden'}`} loading={isLoading} type={'submit'}>
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
