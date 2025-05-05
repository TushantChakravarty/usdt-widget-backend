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
      return record; // Return the updated record
    } else {
      return false
      throw new Error("Record not found");
    }
  } catch (error) {
    console.log(error);
    return [];
    //throw error;  // Handle errors as needed
  }
};

export const createNewRecord = async (Model, createObj) => {
  try {
    // Create a new record using the provided object
    const newRecord = await Model.create(createObj);
    return newRecord; // Return the newly created record
  } catch (error) {
    throw error; // Handle errors as needed
  }
};

export const findRecord = async (Model, query) => {
  try {
    // Find a single record based on the provided query
    const record = await Model.findOne({ where: query });

    if (record) {
      return record; // Return the found record
    } else {
      console.log("Record not found");
      return []; // Handle the case where no record is found
    }
  } catch (error) {
    console.log('error find record',error)
    return [] // Handle errors as needed
  }
};

export const findRecordNew = async (Model, query) => {
  try {
    // Find a single record based on the provided query
    const record = await Model.findOne({ where: query });

    if (record) {
      return record; // Return the found record
    } else {
      console.log("Record not found");
      return null; // Handle the case where no record is found
    }
  } catch (error) {
    throw error; // Handle errors as needed
  }
};

export const findAllRecord = async (Model, query) => {
  try {
    // Find a single record based on the provided query
    const record = await Model.findAll(query);

    if (record) {
      return record; // Return the found record
    } else {
      throw new Error("Record not found"); // Handle the case where no record is found
    }
  } catch (error) {
    throw error; // Handle errors as needed
  }
};

export const findCombinedRecords = async (Model1, Model2, options) => {
  try {
    const {
      limit = 10,
      skip = 0,
      sortField = "createdAt",
      sortOrder = "desc",
    } = options;

    // Fetch data from both models based on the query
    const [data1, data2] = await Promise.all([
      Model1.findAll(),
      Model2.findAll(),
    ]);

    // Combine the data from both models
    // Add type: 'offramp' to each object in data1
    const modifiedData1 = data1.map((item) => ({ ...item.dataValues, type: "offramp" }));

    // Add type: 'onramp' to each object in data2
    const modifiedData2 = data2.map((item) => ({ ...item.dataValues, type: "onramp" }));

    // Combine the modified data arrays
    let combinedData = [...modifiedData1, ...modifiedData2];

    // Sort the combined data based on the provided sort field and order
    combinedData = combinedData.sort((a, b) => {
      const valueA = new Date(a['date']);
      const valueB = new Date(b['date']);

      if (sortOrder === "asc") {
        return valueA - valueB; // Ascending order
      } else {
        return valueB - valueA; // Descending order
      }
    });

    // Apply pagination (skip and limit)
    const paginatedData = combinedData.slice(skip, skip + limit);

    return paginatedData;
  } catch (error) {
    throw error; // Handle errors as needed
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
