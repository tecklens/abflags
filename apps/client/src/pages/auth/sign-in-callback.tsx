import { useNavigate, useSearchParams } from 'react-router-dom'
import { get } from 'lodash'
import { Button } from '@client/components/custom/button'
import { useEffect } from 'react'
import { RepositoryFactory } from '@client/api/repository-factory'
import { AxiosResponse } from 'axios'

const AuthRepository = RepositoryFactory.get('auth')

export default function SignInCallback() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  let params = {}

  for (const entry of searchParams.entries()) {
    params = {
      ...params,
      [entry[0]]: entry[1],
    }
  }

  if (!get(params, 'code') || !get(params, 'state')) {
    return (
      <div className="h-svh">
        <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
          <h1 className="text-[7rem] font-bold leading-tight">404</h1>
          <span className="font-medium">Oops! Page Not Found!</span>
          <p className="text-center text-muted-foreground">
            It seems like the page you're looking for <br />
            does not exist or might have been removed.
          </p>
          <div className="mt-6 flex gap-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Go Back
            </Button>
            <Button onClick={() => navigate('/')}>Back to Home</Button>
          </div>
        </div>
      </div>
    )
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    AuthRepository.githubAuthCallback({
      ...params,
    })
      .then((d: AxiosResponse) => {
        console.log(d.data)
      })
  }, [params])

  return (
    <div></div>
  )
}
