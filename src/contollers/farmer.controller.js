import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import FarmerModel from "./../models/farmer.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Create Farmer
const createFarmer = asyncHandler(async (req, res) => {
  try {
    const {
      farmer_name,
      mobile,
      email,
      nid,
      financial_year,
      type_of_demonstration,
      date_of_demonstration,
      total_area,
      fyield,
      production,
      technology_used,
      other_source_of_water,
      irrigation_method,
      other_mango_variety,
      inspection_details,
      export_experience,
      fenced_orchard,
      wearing_ppe,
      record_book,
      health_hygiene,
      labor_shed,
      remarks,
      google_map_coordinate,
      latitude,
      longitude,
      exported_country,
      upazila_agriculture_office,
      farm_name,
      district,
      address,
      status,
    } = req.body;

    // Set empty string fields to null
    const sanitizedData = {
      farmer_name,
      mobile,
      email,
      nid,
      financial_year,
      type_of_demonstration: type_of_demonstration || null, // Set null if empty
      date_of_demonstration,
      total_area,
      fyield,
      production,
      technology_used,
      other_source_of_water,
      irrigation_method,
      other_mango_variety,
      inspection_details,
      export_experience,
      fenced_orchard,
      wearing_ppe,
      record_book,
      health_hygiene,
      labor_shed,
      remarks,
      google_map_coordinate,
      latitude,
      longitude,
      exported_country: exported_country || null, // Set null if empty
      upazila_agriculture_office: upazila_agriculture_office || null, // Set null if empty
      farm_name,
      district: district || null, // Set null if empty
      address,
      status,
    };

    // Parse JSON fields
    const pesticide_details = JSON.parse(req.body.pesticide_details || "{}");
    const mango_variety = JSON.parse(req.body.mango_variety || "[]");
    const fertilizer_recommendation = JSON.parse(
      req.body.fertilizer_recommendation || "{}"
    );
    const source_of_water = JSON.parse(req.body.source_of_water || "[]");
    const inspection_officer = JSON.parse(req.body.inspection_officer || "[]");

    const { user } = req;
    if (
      !farmer_name ||
      !mobile ||
      !wearing_ppe ||
      !health_hygiene ||
      !labor_shed
    ) {
      throw new ApiError(400, "Required fields are missing");
    }

    // Check if farmer already exists
    const existingFarmer = await FarmerModel.findOne({
      $or: [{ mobile }, { email }, { nid }],
    });
    if (existingFarmer) {
      throw new ApiError(
        409,
        "Farmer with the same mobile, email, or NID already exists"
      );
    }

    // Handle file uploads
    let recordBookUrl = null;
    let farmerPictureUrl = null;
    let gardenPictureUrl = null;

    if (req.files?.record_book) {
      try {
        const result = await uploadOnCloudinary(
          req.files.record_book[0].buffer
        );
        recordBookUrl = result.secure_url;
      } catch (error) {
        throw new ApiError(500, "Error uploading record book image");
      }
    }

    if (req.files?.farmer_picture) {
      try {
        const result = await uploadOnCloudinary(
          req.files.farmer_picture[0].buffer
        );
        farmerPictureUrl = result.secure_url;
      } catch (error) {
        throw new ApiError(500, "Error uploading farmer picture");
      }
    }

    if (req.files?.garden_picture) {
      try {
        const result = await uploadOnCloudinary(
          req.files.garden_picture[0].buffer
        );
        gardenPictureUrl = result.secure_url;
      } catch (error) {
        throw new ApiError(500, "Error uploading garden picture");
      }
    }

    // Create a new farmer record with sanitized data
    const farmer = await FarmerModel.create({
      ...sanitizedData, // Use the sanitized data with null values where needed
      pesticide_details,
      mango_variety,
      fertilizer_recommendation,
      source_of_water,
      inspection_officer,
      record_book: recordBookUrl,
      farmer_picture: farmerPictureUrl,
      garden_picture: gardenPictureUrl,
      created_by: user._id,
    });

    res
      .status(201)
      .json(new ApiResponse(201, farmer, "Farmer created successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Error creating farmer");
  }
});

// Get all farmers
const getAllFarmers = asyncHandler(async (req, res) => {
  try {
    const farmers = await FarmerModel.find()
      .populate("created_by", "full_name")
      .populate("district", "name")
      .populate("type_of_demonstration", "title")
      .populate("exported_country", "name")
      .populate("upazila_agriculture_office", "name");
    res.status(200).json(new ApiResponse(200, farmers, "All farmers"));
  } catch (error) {
    throw new ApiError(500, error.message || "Error fetching farmers");
  }
});

// Get farmer by ID
const getFarmerById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const farmer = await FarmerModel.findById(id)
      .populate("created_by", "full_name")
      .populate("district", "name")
      .populate("type_of_demonstration", "title")
      .populate("exported_country", "name")
      .populate("upazila_agriculture_office", "name");

    if (!farmer) {
      throw new ApiError(404, "Farmer not found");
    }
    res.status(200).json(new ApiResponse(200, farmer, "Farmer details"));
  } catch (error) {
    throw new ApiError(500, error.message || "Error fetching farmer");
  }
});

// Update Farmer
const updateFarmer = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const {
      farmer_name,
      mobile,
      email,
      nid,
      financial_year,
      type_of_demonstration,
      date_of_demonstration,
      total_area,
      fyield,
      production,
      technology_used,
      export_experience,
      other_source_of_water,
      other_mango_variety,
      fenced_orchard,
      wearing_ppe,
      record_book,
      health_hygiene,
      labor_shed,
      inspection_details,
      remarks,
      google_map_coordinate,
      latitude,
      longitude,
      irrigation_method,
      exported_country,
      upazila_agriculture_office,
      farm_name,
      district,
      address,
      status,
    } = req.body;

    // Set empty string fields to null
    const sanitizedData = {
      farmer_name,
      mobile,
      email,
      nid,
      financial_year,
      type_of_demonstration: type_of_demonstration || null, // Set null if empty
      date_of_demonstration,
      total_area,
      fyield,
      production,
      technology_used,
      other_source_of_water,
      irrigation_method,
      other_mango_variety,
      inspection_details,
      export_experience,
      fenced_orchard,
      wearing_ppe,
      record_book,
      health_hygiene,
      labor_shed,
      remarks,
      google_map_coordinate,
      latitude,
      longitude,
      exported_country: exported_country || null, // Set null if empty
      upazila_agriculture_office: upazila_agriculture_office || null, // Set null if empty
      farm_name,
      district: district || null, // Set null if empty
      address,
      status,
    };

    const pesticide_details = JSON.parse(req.body.pesticide_details || "{}");
    const mango_variety = JSON.parse(req.body.mango_variety || "[]");
    const fertilizer_recommendation = JSON.parse(
      req.body.fertilizer_recommendation || "{}"
    );
    const source_of_water = JSON.parse(req.body.source_of_water || "[]");
    const inspection_officer = JSON.parse(req.body.inspection_officer || "[]");

    const farmer = await FarmerModel.findById(id);

    if (!farmer) {
      throw new ApiError(404, "Farmer not found");
    }

    let recordBookUrl = null;
    let farmerPictureUrl = null;
    let gardenPictureUrl = null;

    if (req.files?.record_book) {
      try {
        const result = await uploadOnCloudinary(
          req.files.record_book[0].buffer
        );
        recordBookUrl = result.secure_url;
      } catch (error) {
        throw new ApiError(500, "Error uploading record book image");
      }
    }

    if (req.files?.farmer_picture) {
      try {
        const result = await uploadOnCloudinary(
          req.files.farmer_picture[0].buffer
        );
        farmerPictureUrl = result.secure_url;
      } catch (error) {
        throw new ApiError(500, "Error uploading farmer picture");
      }
    }

    if (req.files?.garden_picture) {
      try {
        const result = await uploadOnCloudinary(
          req.files.garden_picture[0].buffer
        );
        gardenPictureUrl = result.secure_url;
      } catch (error) {
        throw new ApiError(500, "Error uploading garden picture");
      }
    }

    const updatedFarmer = await FarmerModel.findByIdAndUpdate(
      id,
      {
        ...sanitizedData, // Use the sanitized data with null values where needed
        pesticide_details,
        mango_variety,
        fertilizer_recommendation,
        source_of_water,
        inspection_officer,
        record_book: recordBookUrl || farmer.record_book,
        farmer_picture: farmerPictureUrl || farmer.farmer_picture,
        garden_picture: gardenPictureUrl || farmer.garden_picture,
        updated_by: req.user._id,
      },
      { new: true }
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedFarmer,
          "Farmer details updated successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message || "Error updating farmer");
  }
});

// Delete Farmer
const deleteFarmer = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const farmer = await FarmerModel.findById(id);

    if (!farmer) {
      throw new ApiError(404, "Farmer not found");
    }

    await FarmerModel.findByIdAndDelete(id);

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Farmer deleted successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Error deleting farmer");
  }
});

const getFarmerByDistrict = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const farmers = await FarmerModel.find({ district: id })
      .populate("created_by", "full_name")
      .populate("district", "name")
      .populate("type_of_demonstration", "title")
      .populate("exported_country", "name")
      .populate("upazila_agriculture_office", "name");
    res.status(200).json(new ApiResponse(200, farmers, "Farmers by district"));
  } catch (error) {
    throw new ApiError(500, error.message || "Error fetching farmers");
  }
});

export {
  createFarmer,
  getAllFarmers,
  getFarmerById,
  updateFarmer,
  deleteFarmer,
  getFarmerByDistrict,
};
