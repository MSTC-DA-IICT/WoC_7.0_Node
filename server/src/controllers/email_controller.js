import ImpMail from "../models/maillist_model.js"; // Adjust the path based on your file structure

// Add a new category
export const addCategory = async (req, res) => {
  const { category } = req.body;
  try {
    const newCategory = new ImpMail({ category, nameTomail_map: [] });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: "Failed to add category" });
  }
};

// Remove a category
export const removeCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    await ImpMail.findByIdAndDelete(categoryId);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete category" });
  }
};

// Add an email to a category
export const addEmail = async (req, res) => {
  const { categoryId } = req.params;
  const { name, mailId } = req.body;
  try {
    const category = await ImpMail.findById(categoryId);
    if (!category) return res.status(404).json({ error: "Category not found" });

    category.nameTomail_map.push({ name, mailId });
    await category.save();
    res.status(201).json({ message: "Email added successfully", category });
  } catch (err) {
    res.status(500).json({ error: "Failed to add email" });
  }
};

// Remove an email from a category
export const removeEmail = async (req, res) => {
  const { categoryId, emailId } = req.params;
  try {
    const category = await ImpMail.findById(categoryId);
    if (!category) return res.status(404).json({ error: "Category not found" });

    const email = category.nameTomail_map.id(emailId);
    if (!email) return res.status(404).json({ error: "Email not found" });

    email.remove();
    await category.save();
    res.status(200).json({ message: "Email deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete email" });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await ImpMail.find({}, { category: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// Get all emails for a specific category
export const getEmails = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const category = await ImpMail.findById(categoryId, { nameTomail_map: 1, _id: 0 });
    if (!category) return res.status(404).json({ error: "Category not found" });

    res.json(category.nameTomail_map);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch emails" });
  }
};
