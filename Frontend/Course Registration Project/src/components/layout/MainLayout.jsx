import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* Sidebar — sticky on desktop, drawer on mobile */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 lg:p-8 max-w-screen-2xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}