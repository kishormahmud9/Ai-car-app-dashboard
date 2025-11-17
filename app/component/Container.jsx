import React from 'react'

const Container = ({children,className}) => {
  return (
    <div className={`min-w-[1276px] wrap-anywhere ${className}`}>
      {children}
    </div>
  )
}

export default Container
