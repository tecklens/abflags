import { Card } from '@client/components/ui/card'
import { ForgotForm } from './components/forgot-form'
import { Link } from 'react-router-dom'
import { useTheme } from '@client/components/theme-provider'

export default function ForgotPassword() {
  const { theme } = useTheme()
  return (
    <>
      <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
          <div className='mb-4 flex items-center justify-center space-x-3'>
            <img
              src={`/logo_${theme}_2.png`}
              className=""
              width={28}
              height={28}
              alt="Logo"
            />
            <h1 className="text-xl font-medium">Tecklens Wolf</h1>
          </div>
          <Card className="p-6">
            <div className='mb-2 flex flex-col space-y-2 text-left'>
              <h1 className='text-md font-semibold tracking-tight'>
                Forgot Password
              </h1>
              <p className='text-sm text-muted-foreground'>
                Enter your registered email and <br /> we will send you a OTP
                to reset your password.
              </p>
            </div>
            <ForgotForm />
            <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
              Don't have an account?{' '}
              <Link
                to='/sign-up'
                className='underline underline-offset-4 hover:text-primary'
              >
                Sign up
              </Link>
              .
            </p>
          </Card>
        </div>
      </div>
    </>
  )
}
