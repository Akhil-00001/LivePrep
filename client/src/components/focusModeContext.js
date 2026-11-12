import { createContext, useContext, useEffect } from 'react'

// Lets a page (the live interview) hide the app chrome while it is active.
export const FocusModeContext = createContext({ focus: false, setFocus: () => {} })

export const useFocusModeState = () => useContext(FocusModeContext).focus

// Call inside a component to enable focus mode for as long as it is mounted.
export function useFocusMode() {
  const { setFocus } = useContext(FocusModeContext)
  useEffect(() => {
    setFocus(true)
    return () => setFocus(false)
  }, [setFocus])
}
