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
        await Academic.findOneAndDelete({ category: categoryId });
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete category" });
    }
}

export const addCourse = async (req, res) => {
    const { categoryId } = req.params;
    const { name } = req.body;
    try {
        const category = await Academic.findOne({ category: categoryId });
        if (!category) return res.status(404).json({ error: "Category not found" });
        const course = { name, files: [] }
        category.courses.push(course);
        await category.save();
        res.status(201).json(course);
    } catch (err) {
        res.status(500).json({ error: "Failed to add course" });
    }
}

export const removeCourse = async (req, res) => {
    const { categoryId, courseId } = req.params;
    try {
        // Find the category by its ID
        const category = await Academic.findOne({ category: categoryId });
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        console.log(courseId);

        // Find the course by name
        const courseIndex = category.courses.findIndex(course => {
            console.log(course.name); // Debugging
            return course.name === courseId;
        });

        if (courseIndex === -1) {
            return res.status(400).json({ error: "Course not found" });
        }

        // Remove the course by its index
        category.courses.splice(courseIndex, 1);

        // Save the updated category
        await category.save();
        res.status(200).json({ message: "Course deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete course" });
    }
};



export const addFile = async (req, res) => {
    const { categoryId, courseId } = req.params;
    const { file, name, fileType } = req.body;

    try {
        let fileUrl = null;
        let public_id = null;

        // If a file is provided, upload it to Cloudinary
        if (file) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(`data:${fileType};base64,${file}`, {
                    resource_type: "auto", // Use "raw" for files like PDFs
                });
                fileUrl = uploadResponse.secure_url;
                public_id = uploadResponse.public_id;
            } catch (uploadError) {
                console.error("File upload error:", uploadError.message);
                return res.status(500).json({ message: "Failed to upload file" });
            }
        } else {
            console.log("No file provided");
        }

        const category = await Academic.findById(categoryId);
        if (!category) return res.status(404).json({ error: "Category not found" });

        const course = category.courses.id(courseId);
        if (!course) return res.status(404).json({ error: "Course not found" });

        const newFile = {
            name,
            url: fileUrl,
            public_id,
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
};

export const removeFile = async (req, res) => {
    const { categoryId, courseId, fileId } = req.params;

    try {
        const category = await Academic.findById(categoryId);
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
        const category = await Academic.findOne({ category: categoryId });
        if (!category) return res.status(404).json({ error: "Category not found" });

        // const courseNames = category.courses.map(course => course.name);
        res.json(category.courses);
        console.log(category.courses)
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch course names" });
    }
}

export const getFiles = async (req, res) => {
    const { categoryId, courseId } = req.params;

    try {
        console.log(categoryId)
        console.log(courseId)
        const category = await Academic.findById(categoryId, { courses: 1 });
        if (!category) return res.status(404).json({ error: "Category not found" });

        const course = category.courses.id(courseId);
        if (!course) return res.status(404).json({ error: "Course not found" });

        res.json(course.files);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch files" });
    }
}