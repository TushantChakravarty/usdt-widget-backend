import db from "../models/index.js";
const { Fees } = db;

export const findOneAndUpdate = async (Model, query, updateObj) => {
  try {
    // Find the record based on the query
    const record = await Model.findOne({ where: query });
    //console.log(record)
    if (record) {
      // Update the record with the provided update object
      await record.update(updateObj);
      return record;  // Return the updated record
    } else {
      throw new Error("Record not found");
    }
  } catch (error) {
    console.log(error)
    return []
    //throw error;  // Handle errors as needed
  }
};

export const createNewRecord = async (Model, createObj) => {
  try {
    // Create a new record using the provided object
    const newRecord = await Model.create(createObj);
    return newRecord;  // Return the newly created record
  } catch (error) {
    throw error;  // Handle errors as needed
  }
};

export const findRecord = async (Model, query) => {
  try {
    // Find a single record based on the provided query
    const record = await Model.findOne({ where: query });

    if (record) {
      return record;  // Return the found record
    } else {
      console.log("Record not found");
      return []  // Handle the case where no record is found
    }
  } catch (error) {
    throw error;  // Handle errors as needed
  }
};

export const findAllRecord = async (Model, query) => {
  try {
    // Find a single record based on the provided query
    const record = await Model.findAll(query);

    if (record) {
      return record;  // Return the found record
    } else {
      throw new Error("Record not found");  // Handle the case where no record is found
    }
  } catch (error) {
    throw error;  // Handle errors as needed
  }
};

export const getFee = async () => {
  // Try to find the existing fee record
  let fee = await Fees.findOne();

  // If no record exists, create a default one
  if (!fee) {
      fee = await Fees.create({
          onrampFee: {
              platformFee: 2.5, // Default platform fee
          },
          offrampFee: {
              offrampFeePercentage: 1.5,
              gatewayFeePercentage: 2.0,
              tdsFeePercentage: 0.5,
          },
      });
  }

  // Return the existing or newly created fee record
  return fee;
};



