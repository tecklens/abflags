import { IconPlanet } from '@tabler/icons-react'

export default function ComingSoon({ className = '' }: { className?: string }) {
  return (
    <div className={`h-svh ${className}`}>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <IconPlanet size={72} />
        <h1 className='text-4xl font-bold leading-tight'>Coming Soon 👀</h1>
        <p className='text-center text-muted-foreground'>
          This page has not been created yet. <br />
          Stay tuned though!
        </p>
      </div>
    </div>
  )
}
