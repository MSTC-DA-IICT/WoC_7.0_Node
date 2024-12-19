import cloudinary from "../lib/cloudinary.js"
import Academic from "../models/sharedlib_model.js"

export const addCategory = async (req, res) => {
    const { category } = req.body;
    try {
        const newCategory = new Academic({ category, courses: [] });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(500).json({ error: "Failed to add category" });
    }
}

export const removeCategory = async (req, res) => {
    const { categoryId } = req.params;
    try {
        await Academic.findByIdAndDelete(categoryId);
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete category" });
    }
}

export const addCourse = async (req, res) => {
    const { categoryId } = req.params;
    const { name } = req.body;
    try {
        const category = await Academic.findById(categoryId);
        if (!category) return res.status(404).json({ error: "Category not found" });
        category.courses.push({ name, files: [] });
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ error: "Failed to add course" });
    }
}

export const removeCourse = async (req, res) => {
    const { categoryId, courseId } = req.params;
    try {
        const category = await Academic.findById(categoryId);
        if (!category) return res.status(404).json({ error: "Category not found" });
        category.courses.id(courseId).remove();
        await category.save();
        res.status(200).json({ message: "Course deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete course" });
    }
}

export const addFile = async (req, res) => {
    const { categoryId, courseId } = req.params;

    try {
        if (!req.files || !req.files.file) {
        return res.status(400).json({ error: "No file uploaded" });
        }

        const file = req.files.file;

        const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
        resource_type: "auto", // Automatically detects file type
        folder: "shared_library", // Optional: set folder for better organization
        });

        const category = await Academic.findById(categoryId);
        if (!category) return res.status(404).json({ error: "Category not found" });

        const course = category.courses.id(courseId);
        if (!course) return res.status(404).json({ error: "Course not found" });

        const newFile = {
        name: file.name,
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id, // Extract public_id from Cloudinary response
        };

        course.files.push(newFile);

        await category.save();

        res.status(201).json({
        message: "File uploaded successfully",
        file: newFile,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to upload file" });
    }
}

export const removeFile = async (req, res) => {
    const { categoryId, courseId, fileId } = req.params;

    try {
        const category = await Category.findById(categoryId);
        if (!category) return res.status(404).json({ error: "Category not found" });

        const course = category.courses.id(courseId);
        if (!course) return res.status(404).json({ error: "Course not found" });

        const file = course.files.id(fileId);
        if (!file) return res.status(404).json({ error: "File not found" });

        await cloudinary.uploader.destroy(file.public_id);

        file.remove();
        await category.save();

        res.status(200).json({ message: "File deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete file" });
    }
}

export const getCategory = async (req, res) => {
    try {
        const categories = await Academic.find({}, { category: 1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch categories" });
    }
}

export const getCourses = async (req, res) => {
    const { categoryId } = req.params;
    try {
        const category = await Academic.findById(categoryId, { "courses.name": 1, _id: 0 });
        if (!category) return res.status(404).json({ error: "Category not found" });

        const courseNames = category.courses.map(course => course.name);
        res.json(courseNames);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch course names" });
    }
}

export const getFiles = async (req, res) => {
    const { categoryId, courseId } = req.params;
    try {
        const category = await Academic.findById(categoryId, { courses: 1 });
        if (!category) return res.status(404).json({ error: "Category not found" });
    
        const course = category.courses.id(courseId);
        if (!course) return res.status(404).json({ error: "Course not found" });
    
        res.json(course.files);
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch files" });
      }
}