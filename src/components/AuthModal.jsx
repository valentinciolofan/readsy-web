import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { auth, googleProvider, fbProvider, appleProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "../firebase/firebaseConfig";

const AuthModal = ({ showAuthModal, closeModal }) => {
  const navigate = useNavigate();
  const [changeModal, setChangeModal] = useState('signIn');
  const [animationClass, setAnimationClass] = useState('fadeIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const switchModal = () => {
    setAnimationClass("fade-out-right");
    setTimeout(() => {
      setChangeModal((prevState) => (prevState === "signIn" ? "signUp" : "signIn"));
      setAnimationClass("fade-in-left");
    }, 300);
  };

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('User registered successfully');
      closeModal();
    } catch (error) {
      console.error('Error during sign-up:', error.message);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in successfully');
      closeModal();
    } catch (error) {
      console.error('Error during sign-in:', error.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log('Signed in with Google');
      closeModal();
      navigate('/dashboard');
    } catch (error) {
      console.error('Error with Google Sign-In:', error.message);
    }
  };

  const signInWithFacebook = async () => {
    try {
      await signInWithPopup(auth, fbProvider);
      console.log('Signed in with Facebook');
      closeModal();
    } catch (error) {
      console.error('Error with Facebook Sign-In:', error.message);
    }
  };

  const signInWithApple = async () => {
    try {
      await signInWithPopup(auth, appleProvider);
      console.log('Signed in with Apple');
      closeModal();
    } catch (error) {
      console.error('Error with Apple Sign-In:', error.message);
    }
  };

  const handleOutsideClick = (e) => {
    const targetModal = e.target.closest(".auth-form");
    if (!targetModal) {
      closeModal();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  };

  useEffect(() => {
    if (showAuthModal) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showAuthModal]);

  return (
    <>
      {showAuthModal && (
        <div className="modal-auth-overlay" onClick={handleOutsideClick}>
          {changeModal === "signIn" ? (
            <div className={`auth-form ${animationClass}`} id="sign-in" key="sign-in">
              <div className="modal-header">
                <p className="font-normal">Log In</p>
                <svg onClick={closeModal} className="closeBtn" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z" />
                </svg>
              </div>
              <img src="src/assets/images/logo-white.svg" className="auth-readsy-logo" alt="Logo" />
              <form onSubmit={handleSignIn}>
                <label htmlFor="email" className="bold">
                  Email
                  <input type="email" name="email" value={email} onChange={handleEmailChange} />
                </label>
                <label htmlFor="password" className="bold">
                  Password
                  <input type="password" name="password" value={password} onChange={handlePasswordChange} />
                </label>
                <input type="submit" name="submit" className="btn-primary full" id="loginButton" />
              </form>
              <div className="alternative-auth-methods">
                <p className="font-normal bold alternative-meth-divider">or</p>
                <button type="button" className="alternative-auth-way" onClick={signInWithGoogle}>
                  <img src="src/assets/images/googlelogo.svg" alt="Google" />
                  <p className="font-medium">Continue with Google</p>
                </button>
                <button type="button" className="alternative-auth-way" onClick={signInWithFacebook}>
                  <img src="src/assets/images/facebooklogo.svg" alt="Facebook" />
                  <p className="font-medium">Continue with Facebook</p>
                </button>
                <button type="button" className="alternative-auth-way" onClick={signInWithApple}>
                  <img src="src/assets/images/applelogo.svg" alt="Apple" />
                  <p className="font-medium">Continue with Apple</p>
                </button>
              </div>
              <p className="font-normal">
                New to Readsy?{" "}
                <button type="button" className="modal-sign-up-link" onClick={switchModal}>
                  <b>Sign Up</b>
                </button>
              </p>
            </div>
          ) : (
            <div className={`auth-form ${animationClass}`} id="sign-up" key="sign-up">
              <div className="modal-header">
                <p className="font-normal">Sign Up</p>
                <svg onClick={closeModal} className="closeBtn" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z" />
                </svg>
              </div>
              <img src="src/assets/images/logo-white.svg" className="auth-readsy-logo" alt="Logo" />
              <form onSubmit={handleSignUp}>
                <label htmlFor="email" className="bold">
                  Email
                  <input type="email" name="email" value={email} onChange={handleEmailChange} />
                </label>
                <label htmlFor="password" className="bold">
                  Password
                  <input type="password" name="password" value={password} onChange={handlePasswordChange} />
                </label>
                <input type="submit" name="submit" className="btn-primary full" id="registerButton" />
              </form>
              <div className="alternative-auth-methods">
                <p className="font-normal bold alternative-meth-divider">or</p>
                <button type="button" className="alternative-auth-way" onClick={signInWithGoogle}>
                  <img src="src/assets/images/googlelogo.svg" alt="Google" />
                  <p className="font-medium">Continue with Google</p>
                </button>
                <button type="button" className="alternative-auth-way" onClick={signInWithFacebook}>
                  <img src="src/assets/images/facebooklogo.svg" alt="Facebook" />
                  <p className="font-medium">Continue with Facebook</p>
                </button>
                <button type="button" className="alternative-auth-way" onClick={signInWithApple}>
                  <img src="src/assets/images/applelogo.svg" alt="Apple" />
                  <p className="font-medium">Continue with Apple</p>
                </button>
              </div>
              <p className="font-normal">
                Already have an account?{" "}
                <button type="button" className="modal-sign-in-link" onClick={switchModal}>
                  <b>Sign In</b>
                </button>
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AuthModal;
