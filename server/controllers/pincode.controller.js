import * as PincodeModel from "../models/pincode.model.js";

// List all pincodes
export const getAllPincodes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const result = await PincodeModel.getAll(page, limit);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Search pincodes
export const searchPincodes = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: "Query needed" });
    }
    const results = await PincodeModel.search(q);
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get details by pincode
export const getPincodeDetails = async (req, res) => {
  try {
    const { pincode } = req.params;
    const result = await PincodeModel.getByPincode(pincode);
    if (!result) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get area pincodes
export const getAreaPincodes = async (req, res) => {
  try {
    const { area } = req.params;
    const results = await PincodeModel.getByArea(decodeURIComponent(area));
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Add new pincode
export const addPincode = async (req, res) => {
  try {
    const { pincode, area_name, district, state } = req.body;
    if (!pincode || !area_name) {
      return res.status(400).json({ success: false, message: "Data missing" });
    }
    const existing = await PincodeModel.getByPincode(pincode);
    if (existing) {
      return res.status(409).json({ success: false, message: "Exists" });
    }
    const result = await PincodeModel.create({ pincode, area_name, district, state });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete a pincode
export const deletePincode = async (req, res) => {
  try {
    const { pincode } = req.params;
    const deleted = await PincodeModel.remove(pincode);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
