import { Router } from "express";
import {
  getAllPincodes,
  searchPincodes,
  getPincodeDetails,
  getAreaPincodes,
  addPincode,
  deletePincode,
} from "../controllers/pincode.controller.js";

const router = Router();

// Routes for pincodes
router.get("/", getAllPincodes);
router.get("/search", searchPincodes);
router.get("/:pincode", getPincodeDetails);
router.post("/", addPincode);
router.delete("/:pincode", deletePincode);

export default router;
