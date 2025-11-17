import React, { Suspense } from 'react'
import LogIn from './LogIn'

const page = () => {
  return (
    <div>
      <Suspense>
        <LogIn/>
      </Suspense>
    </div>
  )
}

export default page
