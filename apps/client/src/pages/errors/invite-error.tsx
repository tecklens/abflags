import { Button } from '@client/components/custom/button'

export default function InviteError() {
  return (
    <div className=''>
      <div className='m-auto flex w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] font-bold leading-tight'>503</h1>
        <span className='font-medium'>Active Session!</span>
        <p className='text-center text-muted-foreground'>
          The invite is not valid for the current user. Please log in with the right user.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline'>Learn more</Button>
        </div>
      </div>
    </div>
  )
}
