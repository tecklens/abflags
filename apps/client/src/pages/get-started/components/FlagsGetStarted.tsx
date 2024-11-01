import { Button } from '@client/components/custom/button'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function FlagsGetStarted() {
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
      <div className={'font-semibold text-lg'}>What is a feature flag?</div>
      <div className={'max-w-md'}>
        A feature flag is a software development tool used to safely activate or deactivate features without modifying the source code or performing a new deployment. - by Split Software
      </div>
      <Link to={'/'}>
        <Button>View feature flags</Button>
      </Link>
    </motion.div>
  )
}
