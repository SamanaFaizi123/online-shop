import { useEffect, useState } from "react"
import PostBlog from "./PostBlog"
import BlogCard from "./BlogCard"
import HeroSection from "./HeroSection"

function BlogList() {
  const [data, setData] = useState<any>(null)
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/")
        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }

        const data = await response.json()
        setData(data)
      
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [data])

  const renderBlog = (data: any) => {
    return data.posts.map((blog: any, index: number) => (
      <BlogCard
        key={index}
        title={blog.title}
        content={blog.content}
        imageUrl={blog.imageUrl}
        id={blog.id}
      />
    ))
  }

  return (
    <div>
      <HeroSection />
      <PostBlog />
    
        <main
          className="w-screen flex justify-center flex-wrap items-center"
          id="main"
        >
          <div className="container flex flex-wrap">
            {data && renderBlog(data)}
          </div>
        </main>
      
    </div>
  )
}

export default BlogList
