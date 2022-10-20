// const BlogModel = require("../models/Blog");
const FolderDBService = require("./DBService");

exports.getAllBlogs = async (req) => {
  return await FolderDBService.getAllFolders(req);
  // return await BlogModel.find();
};

exports.createBlog = async (blog) => {
  return await FolderDBService.createFolder(blog);
  // return await BlogModel.create(blog);
};
exports.getBlogById = async (id) => {
  return await FolderDBService.getFoldersById(id);
  // return await BlogModel.findById(id);
};

exports.updateBlog = async (id, blog) => {
  return await FolderDBService.updateFolders(id, blog);
  // return await BlogModel.findByIdAndUpdate(id, blog);
};

exports.deleteBlog = async (id) => {
  return await FolderDBService.deleteFolders(id);
  // return await BlogModel.findByIdAndDelete(id);
};

exports.deleteAllBlogs = async () => {
  return await FolderDBService.deleteAllFolders();
  // return await BlogModel.deleteAll();
}
