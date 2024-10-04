import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride'
import { useState } from 'react'
import { throttle } from 'lodash'

export default function SidebarTour({onOpenCollapse}: {onOpenCollapse: Function}) {
  const [run, setRun] = useState(false)
  const steps: Array<Step> = [
    {
      target: '.org-switcher',
      content: <div>You can select your organization here.</div>,
      locale: { skip: <strong aria-label="skip">SKIP</strong> },
      disableBeacon: true,

    },
    {
      target: '.env-switcher',
      content: <div>Switch between development and production environments.</div>,
      spotlightPadding: 20,
      disableBeacon: true,
    },
  ]

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false)
    }
  };

  const onRun = throttle(() => {
    onOpenCollapse()
    setTimeout(() => {
      setRun(true)
    }, 300)
  }, 1000)

  return (
    <div>
      <Joyride
        callback={handleJoyrideCallback}
        continuous
        scrollToFirstStep
        showProgress
        showSkipButton
        run={run}
        steps={steps}
        styles={{
          options: {
            zIndex: 10000,
          },
        }}
      />
      <div id={'trigger-sidebar-tour'} onClick={onRun}/>
    </div>
  )
}