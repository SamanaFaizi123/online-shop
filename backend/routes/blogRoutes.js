const express = require("express")
const data = require("../public/data.json")
const path = require("path")
const fs = require("fs")
const { abort } = require("process")

const multer = require("multer")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/") // Ensure the uploads folder exists
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })

const router = express.Router()

router.get("/", (req, res, next) => {
  res.json(data)
  res.status(200)
})

router.get("/:id", (req, res, next) => {
  const { id } = req.params
  const blog = data.posts.find((blog) => parseInt(blog.id) === parseInt(id))
  res.json(blog)
})
// Define a route to serve static files from the 'uploads' directory
router.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Define your route to handle requests for images
router.get("/uploads/:imageUrl", (req, res, next) => {
  // Sanitize and validate the imageUrl parameter to ensure it's safe
  const { imageUrl } = req.params

  // Construct an absolute path to the file based on the imageUrl
  const parentDir = path.resolve(__dirname, "..")
  const absoluteImagePath = path.join(parentDir, "uploads", imageUrl)
  // console.log(absoluteImagePath)
  // console.log(__dirname)
  // console.log(parentDir)

  // Use proper error handling to handle cases where the file does not exist or cannot be served
  res.sendFile(absoluteImagePath, (err) => {
    if (err) {
      console.error("Error sending file:", err)
      res.status(err.status || 500).send("File not found")
    }
  })
})
router.post("/", upload.single("imageUrl"), (req, res, next) => {
  const parentDir = path.resolve(__dirname, "..")
  const blog = req.body

  // Retrieve the file name of the uploaded file
  if (req.file) {
    const uploadedFileName = req.file.filename
    blog.imageUrl = uploadedFileName
  }

  // Assign the uploaded file name to the imageUrl property in the blog object

  data.posts.unshift(blog)

  // Write updated data to the JSON file
  const filePath = path.join(parentDir, "/public/data.json")
  fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error("Error writing to JSON file:", err)
      res.status(500).json({ error: "Failed to write to JSON file" })
    } else {
      console.log("Blog added and JSON file updated successfully.")
      res.json(blog)
    }
  })
})

// router.post("/", upload.single("imageUrl"), (req, res, next) => {
//   const blog = req.body
//   blog.imageUrl = req.file.originalname
//   console.log(blog.imageUrl)
//   data.posts.push(blog)
//   fs.writeFile(blog, data.posts)
//   res.json(blog)
// })

router.put("/:id", upload.single("imageUrl"), (req, res, next) => {
  const updatedBlog = req.body
  console.log(updatedBlog)
  const { id } = req.params
  const index = data.posts.findIndex(
    (blog) => parseInt(blog.id) === parseInt(id)
  )
  if (index !== -1) {
    // If there's a file upload, update the imageUrl property
    if (req.file) {
      const filenameWithoutSpaces = req.file.originalname
      updatedBlog.imageUrl = filenameWithoutSpaces
    }

    data.posts[index] = { ...data.posts[index], ...updatedBlog }
    res.json(data.posts[index]) // Send the updated blog post in the response
  } else {
    res.status(404).json({ message: "Blog post not found" })
  }
})

router.delete("/:id", (req, res, next) => {
  const { id } = req.params
  console.log(id)
  const index = data.posts.findIndex(
    (blog) => parseInt(blog.id) === parseInt(id)
  )
  if (index !== -1) {
    data.posts.splice(index, 1)
    res.status(200).json(data.posts)
  } else {
    res.status(404).send("No such blog was found")
  }
})

module.exports = router
