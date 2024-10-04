import { Card } from '@client/components/ui/card'
import { UserAuthForm } from './components/user-auth-form'
import { useTheme } from '@client/components/theme-provider'
import { Link, useSearchParams } from 'react-router-dom'

export default function SignIn2() {
  const { theme } = useTheme()
  const [searchParams] = useSearchParams()
  const inviteToken = searchParams.get('invite_token')

  return (
    <>
      <div
        className="container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8">
          <div className="mb-4 flex items-center justify-center space-x-3">
            <img
              src={`/logo_${theme}_2.png`}
              className=""
              width={28}
              height={28}
              alt="Logo"
            />
            <h1 className="text-xl font-medium">Wolf Notification</h1>
          </div>
          <Card className="p-6">
            <div className="flex flex-col space-y-2 text-left">
              <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
              <p className="text-sm text-muted-foreground">
                Enter your email and password below <br />
                to log into your account
              </p>
            </div>
            <UserAuthForm />
            <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link
                to={`/sign-up${inviteToken == null ? '' : `?inviteToken=${inviteToken}`}`}
                className="underline underline-offset-4 hover:text-primary"
              >
                Sign up
              </Link>
              .
            </p>
            <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
              By clicking login, you agree to our{' '}
              <a
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </a>
              .
            </p>
          </Card>
        </div>
      </div>
    </>
  )
}
