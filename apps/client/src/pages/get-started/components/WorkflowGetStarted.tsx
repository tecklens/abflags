import { Button } from '@client/components/custom/button'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function WorkflowGetStarted() {
  return (
    <motion.div
      transition={{
        tension: 190,
        friction: 70,
        mass: 0.4
      }}
      initial={{
        x: '10%'
      }}
      animate={{ x: 0 }}
      className={'flex flex-col space-y-2 lg:space-y-6'}
    >
      <div className={'font-semibold text-lg'}>You created your first workflow</div>
      <div className={'max-w-md'}>Remember that you need to commit your workflow to the current environment and then activate it before you can
        call it via the API.
      </div>
      <Link to={'/workflow'}>
        <Button>View workflows</Button>
      </Link>
    </motion.div>
  )
}
