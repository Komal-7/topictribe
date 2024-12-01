import type { AppProps } from 'next/app'
import { Amplify } from "aws-amplify"
import {NextUIProvider} from '@nextui-org/react'
import '../styles/global.css'
import { UserProvider } from '@/components/UserContext'
import { Authenticator } from '@aws-amplify/ui-react'
import Navbar from '@/components/CustomNavbar';
const userPoolId = process.env.NEXT_PUBLIC_USER_POOL_ID || '';
const clientId = process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || '';
Amplify.configure({
  Auth: {
    Cognito: {
    userPoolId,
    userPoolClientId: clientId,
  }
},
})
export default function App({ Component, pageProps }: AppProps) {
  return (
    <Authenticator loginMechanisms={['email']} signUpAttributes={['preferred_username']}>
      {({ signOut, user }) => (
        <UserProvider user={user}>
          <NextUIProvider>
            <main>
              <Navbar signOut={signOut} />
              <Component {...pageProps} />
            </main>
          </NextUIProvider>
        </UserProvider>
        
      )}
    </Authenticator>
    
  )
}