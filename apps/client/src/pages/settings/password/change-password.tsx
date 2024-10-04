import {Button} from '@client/components/custom/button'
import {IconLoader2, IconLockAccess} from '@tabler/icons-react'
import {useState} from 'react'
import {Link} from 'react-router-dom'
import {RepositoryFactory} from '@client/api/repository-factory'
import {HttpStatusCode} from 'axios'
import {useToast} from '@client/components/ui/use-toast'

const UserRepository = RepositoryFactory.get('user')

export function ChangePassword() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const sendEmail = async () => {
    try {
      setLoading(true)
      const rsp = await UserRepository.sendChangePassword()
      if (rsp.status === HttpStatusCode.Created) {
        setSent(true)
      } else {
        toast({
          variant: 'destructive',
          content: 'The error occurred when sending the password change email.',
        })
      }
    } catch (e: any) {
      toast({
        variant: 'destructive',
        content: e?.response?.data?.message ?? 'The error occurred when sending the password change email.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {sent ?
        <div className={'flex flex-col'}>
          <span>We have just sent a verification link to your email address</span>
          <Link to={'https://gmail.com'} className={'underline'}>dieptv1999@gmail.com</Link>
          <span>Please verify your email address to proceed with setting a password.</span>
          <span>The password reset link is valid for 2 minutes.</span>
        </div>
        :
        <Button disabled={loading} variant={'outline'} onClick={sendEmail}>
          {loading ? <IconLoader2 className="mr-2 h-4 w-4 animate-spin" /> :
            <IconLockAccess className="mr-2" size={18} />}
          Set password</Button>}
    </div>
  )
}
