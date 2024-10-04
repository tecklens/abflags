import { Button } from '@client/components/custom/button'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function SendNotificationGetStarted() {
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
      className={'flex flex-col space-y-2 lg:space-y-6'}
    >
      <div className={'font-semibold text-lg'}>Send your first notification</div>
      <div className={'max-w-md'}>Once you have a workflow created and committed to your development environment,
        trigger that workflow with a notify call to send your first notification.
      </div>
      <Link to={'/workflow'}>
        <Button>Trigger notification from API</Button>
      </Link>
    </motion.div>
  )
}
