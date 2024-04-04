import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import 'semantic-ui-css/semantic.min.css';
import { SessionProvider } from "next-auth/react"
import { useSession } from "next-auth/react"
import TopMenu from './components/topMenu'
import ChatRoom from './components/chatRoom'

export default function App({ Component, pageProps: { session, ...pageProps} }: AppProps) {

  return (
    <SessionProvider session={session}>
      <TopMenu>
    <ThemeProvider attribute="class">
    <Component {...pageProps} />
  </ThemeProvider>
  </TopMenu>
  </SessionProvider>
  )
}
