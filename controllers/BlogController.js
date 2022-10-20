const blogService = require("../services/BlogService");
const { db } = require("../app");

exports.getAllBlogs = async (req, res) => {
  try {
    console.log("inside getAllBlogs", db);
    const folders = db.collection("Folders").find({});
    console.log("folders", folders);
    // const blogs = await blogService.getAllBlogs(req);
    res.json({ data: folders, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const blog = await blogService.createBlog(req.body);
    res.json({ data: blog, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await blogService.getBlogById(req.params.id);
    res.json({ data: blog, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await blogService.updateBlog(req.params.id, req.body);
    res.json({ data: blog, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await blogService.deleteBlog(req.params.id);
    res.json({ data: blog, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAllBlogs = async (req, res) => {
  try {
    const blog = await blogService.deleteAllBlogs();
    res.json({ data: blog, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
