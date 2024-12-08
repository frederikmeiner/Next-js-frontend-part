"use client"
import { useState } from "react"

export default function Footer() {
    const [count, setCount] = useState(0)

    function handleClick() {
        setCount(count + 1)
    }
  return (
    <footer className="bg-white/50 backdrop-blur">
    <div className="mx-auto max-w-4xl text-center py-6 text-sm text-gray-400"><p>&copy; {new Date().getFullYear()} Birch Production Co.</p>
       <p> Du har trykket på knappen {count} <button onClick={handleClick}>Tryk her</button></p>
        </div>
        </footer>
  )
}