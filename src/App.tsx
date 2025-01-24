'use client'

import { useState, useEffect } from 'react'
import './App.css'
import { NarrativeLayout } from '@/components/layout/NarrativeLayout'
import {MobileLayout} from '@/components/layout/MobileLayout'

// Custom hook for window size
const useWindowSize = () => {
  // Initialize with null to handle SSR
  const [width, setWidth] = useState<number | null>(null)

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      setWidth(window.innerWidth)
    }
    
    // Set initial size
    handleResize()
    
    // Add event listener
    window.addEventListener('resize', handleResize)
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, []) // Empty array ensures effect is only run on mount

  return width
}

// Breakpoint for mobile (you can adjust this value)
const MOBILE_BREAKPOINT = 800 // Typical tablet/mobile breakpoint

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