import React from 'react'
import { Redirect, Route, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const location = useLocation()
  const userAuth = localStorage.getItem('token')
  return (
    <Route exact {...rest}>
      {userAuth 
        ? <Component />
        : <Redirect to={{ pathname: '/', state: { from: location } }} />}
    </Route>
  )
}

export default ProtectedRoute
