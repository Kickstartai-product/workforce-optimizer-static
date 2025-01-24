'use client'

import './App.css'
import { NarrativeLayout } from '@/components/layout/NarrativeLayout'
import { MobileLayout } from '@/components/layout/MobileLayout'
import { useWindowSize, MOBILE_BREAKPOINT } from '@/hooks/useWindowSize'

function App() {
  const windowWidth = useWindowSize()
  
  // Handle SSR case when width is null
  if (windowWidth === null) {
    return null // Or a loading state if preferred
  }

  // Render the appropriate layout based on window width
  return windowWidth < MOBILE_BREAKPOINT ? <MobileLayout /> : <NarrativeLayout />
}

export default App