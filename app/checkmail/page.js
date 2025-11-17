import React, { Suspense } from 'react'
import CheckMail from './CheckMail'

const page = () => {
  return (
    <div>
      <Suspense>
        <CheckMail/>
      </Suspense>
      
    </div>
  )
}

export default page
