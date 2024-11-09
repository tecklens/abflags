import { Button } from '@client/components/custom/button'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function UseSdkGetStarted() {
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
      <Link to={'https://github.com/tecklens/abflags/wiki/Use-SDK'} target={'_blank'}>
        <Button>How to use SDK</Button>
      </Link>
    </motion.div>
  )
}
