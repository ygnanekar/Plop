import React from 'react'
import { WrappedNormalLoginForm } from '../SignupForm/SignupForm';

export default function SignupFormWrapper() {
    return (
        <div style={styles.formContainer}>
            <div style={styles.form}>
                <WrappedNormalLoginForm/>
            </div>
            <div style={styles.formBackground}></div>
        </div>
    )
}

const styles = {
    formContainer : {
      width:'100%',
      backgroundImage: 'url(\'images/wallpaper.png\')',
      backgroundPosition: '0 0'
    },
    form : {
      position: 'absolute',
      bottom: '20%',
      height: '50%',
      left:'0',
      right: '0',
      marginLeft: 'auto',
      marginRight: 'auto',
      width:'20%',
      maxWidth: '20rem',
      zIndex: '3', 
    },
    formBackground : {
      zIndex: '2',
      position: 'absolute',
      bottom: '30%',
      left: '0',
      right: '0',
      marginLeft: 'auto',
      marginRight: 'auto',
      height: '50%',
      width:'30%',
      opacity: 0.6,
      backgroundColor: 'black',
      maxWidth: '25rem'
    }
  }