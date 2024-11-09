import logo from '../assets/logoab.png'
import AbIf from "../../../../libs/react-sdk/src/lib/ab-if";
export function AbWelcome({title}: { title: string }) {
  return (
    <>
      <div className={'w-full flex justify-center my-16'}>
        <div className={'max-w-screen-md w-full mx-3'}>
          <div className={'py-3 w-full'}>
            <div>
              <div className={'text-3xl font-light'}> Hello there,</div>
              <div className={'text-5xl font-semibold'}>Welcome {title} 👋</div>
            </div>
          </div>

          <div className={'p-3 md:p-8 w-full rounded-xl border flex justify-between my-8'}>
            <div className={'flex flex-col gap-3'}>
              <div className={'flex gap-2'}>
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className={'h-8 text-green-600'}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
                <span className={'text-lg md:text-2xl'}>You&apos;re up and running</span>
              </div>
              <a href="https://github.com/tecklens/abflags" target={'_blank'} className={'p-3 border rounded-lg w-fit'}> What&apos;s next? </a>
            </div>
            <img src={logo} alt={'logo abflags'} className={'h-[100px] md:h-[150px] object-contain'}/>
          </div>
          <div className={'my-6 text-xl font-semibold'}>Example for feature flags</div>
          <AbIf
            feature={'feature2'}
            containerClassName={'w-full'}
          >
            {/* a version*/}
            <div>
              A version
            </div>
            {/*  b version (may ) */}
            <div>
              B Version
            </div>
          </AbIf>
        </div>
      </div>
    </>
  );
}

export default AbWelcome;
