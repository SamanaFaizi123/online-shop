import { useState, useEffect } from "react"

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentYear(new Date().getFullYear())
    }, 1000 * 60) 
    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="bg-black text-white py-4 relative bottom-0 w-full">
      <div className="container mx-auto">
        <div className="flex justify-center items-center">
          <p className="text-center">
            &copy; {currentYear} Copy right{" "}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
