'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Bell, Search, MoreVertical } from 'lucide-react'
import Image from "next/image"
import acolyte from '@/public/acolyte.png'
import frame from '@/public/frame.png'
import { Collaborators } from "./collaborators"
import SearchCompoent from '../pdfcomponents/SearchCompoent'

interface HeaderProps {
  title?: string
  lastUpdate?: string
  pages?: number
  annotations?: number

}

export default function Header({
  title = "Heart Analogy",
  lastUpdate = "25 August 2019 at 12:15 PM",
  pages = 120,
  annotations = 120,

}: HeaderProps) {
  // State to toggle search bar visibility and hold search query
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Ref to detect clicks outside the search bar and to focus the input
  const searchBarRef = useRef(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  // Toggle search bar visibility
  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Handle search logic here, for now, we'll just log the search query
    console.log('Search Query:', searchQuery)
  }

  // Close the search bar if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setIsSearchVisible(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus on the search input when the search bar becomes visible
  useEffect(() => {
    if (isSearchVisible && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchVisible])

  return (
    <header className="flex items-center border-b p-1 font-sans bg-white">
      <div className="flex w-[65vw] items-center gap-24">
        <Image alt="acolyte" src={acolyte} className="h-28 w-28 ml-3" />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-11">
            <h1 className="text-2xl font-semibold">{title}</h1>
            <div className="flex items-center gap-11 text-md text-muted-foreground">
              <div className="flex items-center gap-1">
                <Image src={frame} alt="frame" className="h-4 w-4" />
                <span>{pages} Pages</span>
              </div>
              <div className="flex items-center gap-2">
                <Image src={frame} alt="frame" className="h-4 w-4" />
                <span>{annotations} Annotations</span>
              </div>
            </div>
          </div>
          <p className="text-md text-muted-foreground">
            Last Update: {lastUpdate}
          </p>
        </div>
      </div>

      <div className="flex w-[30vw] items-center gap-5">
        <Collaborators />

        {/* <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground custom-button"
        >
          <Bell className="custom-icon" />
        </Button> */}

        {/* Search Button */}
        {/* <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground custom-button"
          onClick={toggleSearch} // Toggle search visibility on click
        >
          <Search className="custom-icon" />
        </Button> */}

        {/* <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground custom-button"
        >
          <MoreVertical className="custom-icon" />
        </Button> */}
      </div>

      {/* Search Bar */}
      {/* {isSearchVisible && (
       <div className=''>
         <div ref={searchBarRef} className="fixed top-32 left-0 right-0 flex justify-center z-50 mt-4">
          <form
            className="w-full max-w-3xl relative"
            onSubmit={handleSearchSubmit} // Handle form submission
          >
            <input
              ref={searchInputRef} // Reference the search input to focus it
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="w-full py-2 px-4 rounded-full shadow-md border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e)} // Handle Enter key to submit
            />
          </form>
        </div>
       </div>
      )} */}

      <SearchCompoent />
    </header>
  )
}
