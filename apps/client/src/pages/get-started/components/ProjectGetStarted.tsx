import {Button} from '@client/components/custom/button'
import {motion} from 'framer-motion'
import {Link} from 'react-router-dom'
import GetStartedProject from '@client/assets/get-started-project.png'
import {useProject} from "@client/lib/store/projectStore";

export default function ProjectGetStarted() {
  const {setOpenSelectProject} = useProject();

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
      animate={{x: 0}}
      className={'flex flex-col space-y-2 lg:space-y-6'}
    >
      <div className={'font-semibold text-lg'}>You created your first project</div>
      <div className={'max-w-md'}>1. When you sign up for an account, we'll automatically create a default project for
        you.
      </div>
      <div className={'max-w-md'}>2. You can create many projects in your project management board.
      </div>
      <div className={'max-w-md'}>3. In each project, there can be multiple members who can view/edit the project. You
        can refer to <Link to={'/members'} className={'text-primary underline'}>here</Link>.
      </div>
      <div>
        <Button onClick={() => setOpenSelectProject(true)}>View project</Button>
      </div>
      <img src={GetStartedProject} className={'max-w-screen-lg aspect-video'} alt={'project'}/>
    </motion.div>
  )
}
