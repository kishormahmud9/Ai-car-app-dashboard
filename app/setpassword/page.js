import React, { Suspense } from 'react'
import SetPassword from './SetPassword'

const page = () => {
  return (
    <div>
      <Suspense>

      <SetPassword/>
      </Suspense>
    </div>
  )
}

export default page
