"use client"

import Image from "next/image"

export function Preloader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="relative flex flex-col items-center">
        <div className="animate-bounce mb-12">
          <Image
            src="/lopez.png"
            alt="Lopez Lab Logo"
            width={300}
            height={300}
            className="object-contain"
            priority
          />
        </div>
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="w-full h-full bg-[#3da64a] animate-progressBar origin-left"></div>
        </div>
      </div>
    </div>
  )
} 