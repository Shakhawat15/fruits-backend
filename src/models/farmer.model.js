import mongoose, { Schema } from "mongoose";

const farmerSchema = new Schema(
  {
    farmer_name: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    nid: {
      type: String,
      unique: true,
      trim: true,
    },
    financial_year: {
      type: String,
    },
    type_of_demonstration: {
      type: Schema.Types.ObjectId,
      ref: "DemonstrationType",
    },
    date_of_demonstration: {
      type: Date,
    },
    total_area: {
      type: Number,
    },
    fyield: {
      type: Number,
    },
    production: {
      type: Number,
    },
    technology_used: {
      type: String,
    },
    pesticide_details: {
      type: Object,
    },
    irrigation_method: {
      type: String,
    },
    source_of_water: {
      type: [String],
    },
    other_source_of_water: {
      type: String,
    },
    mango_variety: {
      type: [String],
    },
    other_mango_variety: {
      type: String,
    },
    inspection_details: {
      type: String,
    },
    inspection_officer: {
      type: [String],
    },
    export_experience: {
      type: String,
    },
    fenced_orchard: {
      type: String,
    },
    fertilizer_recommendation: {
      type: Object,
    },
    wearing_ppe: {
      type: String,
      required: true,
    },
    record_book: {
      type: String,
    },
    health_hygiene: {
      type: String,
      required: true,
    },
    labor_shed: {
      type: String,
      required: true,
    },
    remarks: {
      type: String,
    },
    farmer_picture: {
      type: String,
    },
    garden_picture: {
      type: String,
    },
    google_map_coordinate: {
      type: String,
    },
    latitude: {
      type: String,
    },
    longitude: {
      type: String,
    },
    exported_country: {
      type: Schema.Types.ObjectId,
      ref: "Country",
    },
    upazila_agriculture_office: {
      type: Schema.Types.ObjectId,
      ref: "UpazilaAgricultureOffice",
    },
    farm_name: {
      type: String,
    },
    district: {
      type: Schema.Types.ObjectId,
      ref: "District",
    },
    address: {
      type: String,
    },
    status: {
      type: Number,
      required: true,
      default: 1,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, versionKey: false }
);

const Farmer = mongoose.model("Farmer", farmerSchema);

export default Farmer;
