export const findOneAndUpdate = async (Model, query, updateObj) => {
    try {
      // Find the record based on the query
      const record = await Model.findOne({ where: query });
      
      if (record) {
        // Update the record with the provided update object
        await record.update(updateObj);
        return record;  // Return the updated record
      } else {
        throw new Error("Record not found");
      }
    } catch (error) {
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
        throw new Error("Record not found");  // Handle the case where no record is found
      }
    } catch (error) {
      throw error;  // Handle errors as needed
    }
  };
  
  