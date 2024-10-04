import {Button} from '@client/components/custom/button'
import {motion} from 'framer-motion'
import {IconCopy, IconEye, IconEyeOff, IconGitBranch} from '@tabler/icons-react'
import {Input} from '@client/components/ui/input'
import {useEffect, useState} from 'react'
import {useToast} from '@client/components/ui/use-toast'
import {useEnv} from '@client/lib/store/envStore'
import {Label} from '@client/components/ui/label'

export default function EnvironmentGetStarted() {
  const [show, setShow] = useState(false)
  const { toast } = useToast()

  const { fetchEnv, apiKey } = useEnv(state => state)

  useEffect(() => {
    if (!apiKey)
      fetchEnv()
  }, [fetchEnv, apiKey])

  const copyWorkflowIdentifier = (text: string, titleNoti: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: titleNoti,
        })
      })
  }

  return (
    <motion.div
      transition={{
        tension: 190,
        friction: 70,
        mass: 0.4,
      }}
      initial={{
        x: '10%',
      }}
      animate={{ x: 0 }}
      className={'flex flex-col space-y-3'}
    >
      <div className={'font-semibold text-base'}>1. DEV MODE vs PROD MODE</div>
      <div className={'max-w-screen-md'}>
        When a user registers, two corresponding environments, 'DEV MODE' and 'PROD MODE', will be automatically
        created.
      </div>
      <div>
        <Button onClick={() => {
          document.getElementById('trigger-sidebar-tour')?.click()
        }}>View environment switch</Button>
      </div>
      <div className={'font-semibold text-base'}>2. Organizations</div>
      <div className={'max-w-screen-md'}>
        Your organization is automatically created upon registration. Alternatively, you can join a team via an email
        invitation or a link sent by the owner of those organizations.
      </div>
      <div>
        <Button onClick={() => {
          document.getElementById('trigger-sidebar-tour')?.click()
        }}>View organizations switch</Button>
      </div>
      <div className={'bg-[#F7F7F8] dark:bg-[#27272a] rounded-lg p-3 lg:p-5'}>
        <div className={'w-full flex justify-between space-x-3'}>
          <div className={'flex flex-col'}>
            <div className={'font-bold'}>For developers</div>
            <div>This step requires your secret key.</div>
          </div>
          <div className={'inline-flex space-x-1 text-sm text-green-500'}>
            <IconGitBranch size={18} />
            <div className={''}>Environment: Development</div>
          </div>
        </div>
        <div className={'mt-5'}>
          <Label htmlFor="api-key">
            <div>API Key</div>
            <div className={'text-gray-700 text-xs mt-0.5'}>Use this API key to interact with the Wolf API</div>
          </Label>
          <div className={'flex items-center space-x-2'}>
            <Input
              id={'api-key'}
              type={show ? 'text' : 'password'}
              placeholder="API KEY"
              className={'min-w-[350px]'}
              disabled
              value={apiKey ?? ''}
            />
            <Button
              variant="outline" size="icon" className={'aspect-square'}
              onClick={() => setShow(!show)}
            >
              {show ? <IconEye size={18} /> : <IconEyeOff size={18} />}
            </Button>
            <Button variant="outline" size="icon" className={'aspect-square'} onClick={() => {
              copyWorkflowIdentifier(apiKey ?? '', 'API Key copied to clipboard')
            }}>
              <IconCopy size={18} />
            </Button>
            <Button type="submit">Regenerate</Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
