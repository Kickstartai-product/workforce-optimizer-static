'use client'

import './App.css'
import { NarrativeLayout } from '@/components/layout/NarrativeLayout'
import { MobileLayout } from '@/components/layout/MobileLayout'
import { useWindowSize, MOBILE_BREAKPOINT } from '@/hooks/useWindowSize'
import ScreenAlert from '@/components/ui/ScreenAlert'

function App() {
  const windowWidth = useWindowSize()
  
  // Handle SSR case when width is null
  if (windowWidth === null) {
    return null
  }

  return (
    <>
      <ScreenAlert />
      {windowWidth < MOBILE_BREAKPOINT ? <MobileLayout /> : <NarrativeLayout />}
    </>
  )
}

export default App