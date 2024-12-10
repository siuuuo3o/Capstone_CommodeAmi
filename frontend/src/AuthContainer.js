import React, { useState } from 'react';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';

function AuthContainer() {
  const [isSignup, setIsSignup] = useState(true);

  const toggleForm = () => {
    setIsSignup(!isSignup);
  };

  return (
    <div>
      {isSignup ? (
        <SignupForm toggleForm={toggleForm} />
      ) : (
        <LoginForm toggleForm={toggleForm} />
      )}
    </div>
  );
}

export default AuthContainer;