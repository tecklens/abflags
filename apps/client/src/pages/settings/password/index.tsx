import { Separator } from '@client/components/ui/separator'
import { ChangePassword } from './change-password'
import { useUser } from '@client/lib/store/userStore'
import { Link } from 'react-router-dom'

export default function SettingsPassword() {
  const {user} = useUser()

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Change Password</h3>
        <p className='text-sm text-muted-foreground'>
          The password reset link will be sent to your email <Link to={'https://gmail.com'} className={'underline'}>{user?.email}</Link>.
        </p>
      </div>
      <Separator />
      <ChangePassword />
    </div>
  )
}
