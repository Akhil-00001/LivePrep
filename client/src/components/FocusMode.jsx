import { useState } from 'react'
import { FocusModeContext } from './focusModeContext'

export function FocusModeProvider({ children }) {
  const [focus, setFocus] = useState(false)
  return (
    <FocusModeContext.Provider value={{ focus, setFocus }}>
      {children}
    </FocusModeContext.Provider>
  )
}
