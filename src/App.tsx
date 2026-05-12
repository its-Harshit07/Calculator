import { useState, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { Calculator } from './components/Calculator'
import { useCalculatorStore } from './store/calculatorStore'
import { cn } from './lib/utils'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { isDarkMode } = useCalculatorStore()

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  return (
    <div className={cn(
      "min-h-screen w-full flex items-center justify-center p-0 md:p-6 lg:p-12 transition-colors duration-300",
      "bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-950"
    )}>
      <div className="w-full h-screen md:h-[85vh] max-w-5xl flex relative shadow-2xl rounded-none md:rounded-2xl overflow-hidden glass-panel">
        
        {/* Sidebar Component */}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        {/* Main Application Area */}
        <div className="flex-1 flex flex-col h-full w-full">
          <Calculator onOpenSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>
      </div>
    </div>
  )
}

export default App
