import db from "../models/index.js";

const { User, OnRampTransaction, OffRampTransaction, Payout, Payin,sequelize } = db;

import Sequelize from "sequelize"

export async function sumTodaySuccessTransactionsToAmount() {
  try{
    // console.log("offramo",await OnRampTransaction.findAll())
    const result = await OnRampTransaction.sum('to_amount', {
      where: {
        status: 'SUCCESS',
        date: {
          [Sequelize.Op.gte]: sequelize.fn('DATE', sequelize.fn('NOW')) // this checks for today's date
        }
      }
    });
    console.log("result:------",result)
  
    return result;

  }catch(error){
    console.log(`metrics.service.sumTodaySuccessTransactions`,error.message)
     throw error
  }
 
}

export async function sumTodaySuccessTransactionsFromAmount() {
  try{
    console.log("called this function")
    // console.log("offramo",await OnRampTransaction.findAll())
    const result = await OnRampTransaction.sum('from_amount', {
      where: {
        status: 'SUCCESS',
        date: {
          [Sequelize.Op.gte]: sequelize.fn('DATE', sequelize.fn('NOW')) // this checks for today's date
        }
      }
    });
    console.log("result:------",result)
  
    return result;

  }catch(error){
    console.log(`metrics.service.sumTodaySuccessTransactions`,error.message)
     throw error
  }
 
}

export async function sumYesterdaySuccessTransactionsToAmount(){
  try{
    // console.log("offramo", await OnRampTransaction.findAll())
    const result = await OnRampTransaction.sum('to_amount', {
      where: {
        status: 'SUCCESS',
        date: {
          [Sequelize.Op.gte]: sequelize.fn('DATE', sequelize.literal('CURRENT_DATE - INTERVAL \'1 DAY\'')), // this checks for the start of yesterday
          [Sequelize.Op.lt]: sequelize.fn('DATE', sequelize.literal('CURRENT_DATE')) // this checks for the start of today
        }
      }
    });
  
    return result;
  }catch(error){
    console.log(`metrics.service.sumYesterdaySuccessTransactions`,error.message)
    throw error 
   }
}

export async function sumYesterdaySuccessTransactionsFromAmount(){
  try{
    // console.log("offramo", await OnRampTransaction.findAll())
    const result = await OnRampTransaction.sum('from_amount', {
      where: {
        status: 'SUCCESS',
        date: {
          [Sequelize.Op.gte]: sequelize.fn('DATE', sequelize.literal('CURRENT_DATE - INTERVAL \'1 DAY\'')), // this checks for the start of yesterday
          [Sequelize.Op.lt]: sequelize.fn('DATE', sequelize.literal('CURRENT_DATE')) // this checks for the start of today
        }
      }
    });
  
    return result;
  }catch(error){
    console.log(`metrics.service.sumYesterdaySuccessTransactions`,error.message)
    throw error 
   }
}

export async function allOnrampTransactionCount(){
  try{
    return await OnRampTransaction.count()

  }catch(error){
    console.log(`metrics.service.allOnrampTransactionCount`,error.message)
    throw error
  }
}


export async function countTodayTransactions() {
  try{
  // console.log("offramo",await OnRampTransaction.findAll())
  const result = await OnRampTransaction.count( {
    where: {
      date: {
        [Sequelize.Op.gte]: sequelize.fn('DATE', sequelize.fn('NOW')) // this checks for today's date
      }
    }
  });

  return result;

  }catch(error){
    console.log(`metrics.service.countTodayTransactions`,error.message)
    throw error
  }
  
}

export async function successfullTxCount24hr(){
  try{
    const result = await OnRampTransaction.count( {
      where: {
        status:"SUCCESS",
        date: {
          [Sequelize.Op.gte]: sequelize.fn('DATE', sequelize.fn('NOW')) // this checks for today's date
        }
      }
    });
    console.log("result:------",result)
  
    return result;

  }catch(error){
    console.log(`metrics.service.successfullTxCount24hr`,error.message)
    throw error
  }
}



export async function totalVolumeToAmount() {
  // console.log("offramo",await OnRampTransaction.findAll())
  try{
    const result = await OnRampTransaction.sum('to_amount', {
      where: {
        status: 'SUCCESS'
      }
    });
  
    return result;

  }catch(error){
    console.log(`metrics.service.totalVolume`,error.message)
    throw error
  }
  
}

export async function totalVolumeFromAmount() {
  // console.log("offramo",await OnRampTransaction.findAll())
  try{
    const result = await OnRampTransaction.sum('from_amount', {
      where: {
        status: 'SUCCESS'
      }
    });
  
    return result;

  }catch(error){
    console.log(`metrics.service.totalVolume`,error.message)
    throw error
  }
  
}




// offramp metrices starting from here

export async function sumTodaySuccessTransactionsOffRampToAmount() {
  try{
    console.log("called this function")
    // console.log("offramo",await OnRampTransaction.findAll())
    const result = await OffRampTransaction.sum('to_amount', {
      where: {
        status: 'SUCCESS',
        date: {
          [Sequelize.Op.gte]: sequelize.fn('DATE', sequelize.fn('NOW')) // this checks for today's date
        }
      }
    });
    console.log("result:------",result)
  
    return result;

  }catch(error){
    console.log(`metrics.service.sumTodaySuccessTransactions`,error.message)
     throw error
  }
 
}

export async function sumTodaySuccessTransactionsOffRampFromAmount() {
  try{
    // console.log("offramo",await OnRampTransaction.findAll())
    const result = await OffRampTransaction.sum('from_amount', {
      where: {
        status: 'SUCCESS',
        date: {
          [Sequelize.Op.gte]: sequelize.fn('DATE', sequelize.fn('NOW')) // this checks for today's date
        }
      }
    });
    console.log("result:------",result)
  
    return result;

  }catch(error){
    console.log(`metrics.service.sumTodaySuccessTransactions`,error.message)
     throw error
  }
}

export async function sumYesterdaySuccessTransactionsOfframpToAmount(){
  try{
    // console.log("offramo", await OnRampTransaction.findAll())
    const result = await OffRampTransaction.sum('to_amount', {
      where: {
        status: 'SUCCESS',
        date: {
          [Sequelize.Op.gte]: sequelize.fn('DATE', sequelize.literal('CURRENT_DATE - INTERVAL \'1 DAY\'')), // this checks for the start of yesterday
          [Sequelize.Op.lt]: sequelize.fn('DATE', sequelize.literal('CURRENT_DATE')) // this checks for the start of today
        }
      }
    });
  
    return result;
  }catch(error){
    console.log(`metrics.service.sumYesterdaySuccessTransactions`,error.message)
    throw error 
   }
}


export async function sumYesterdaySuccessTransactionsOfframpFromAmount(){
  try{
    // console.log("offramo", await OnRampTransaction.findAll())
    const result = await OffRampTransaction.sum('from_amount', {
      where: {
        status: 'SUCCESS',
        date: {
          [Sequelize.Op.gte]: sequelize.fn('DATE', sequelize.literal('CURRENT_DATE - INTERVAL \'1 DAY\'')), // this checks for the start of yesterday
          [Sequelize.Op.lt]: sequelize.fn('DATE', sequelize.literal('CURRENT_DATE')) // this checks for the start of today
        }
      }
    });
  
    return result;
  }catch(error){
    console.log(`metrics.service.sumYesterdaySuccessTransactions`,error.message)
    throw error 
   }
}

export async function allOfframpTransactionCount(){
  try{
    return await OffRampTransaction.count()

  }catch(error){
    console.log(`metrics.service.allOnrampTransactionCount`,error.message)
    throw error
  }
}


export async function countTodayTransactionsOfframp() {
  try{
  // console.log("offramo",await OnRampTransaction.findAll())
  const result = await OffRampTransaction.count( {
    where: {
      date: {
        [Sequelize.Op.gte]: sequelize.fn('DATE', sequelize.fn('NOW')) // this checks for today's date
      }
    }
  });

  return result;

  }catch(error){
    console.log(`metrics.service.countTodayTransactions`,error.message)
    throw error
  }
  
}

export async function successfullTxCount24hrofframp(){
  try{
    const result = await OffRampTransaction.count( {
      where: {
        status:"SUCCESS",
        date: {
          [Sequelize.Op.gte]: sequelize.fn('DATE', sequelize.fn('NOW')) // this checks for today's date
        }
      }
    });
    console.log("result:------",result)
  
    return result;

  }catch(error){
    console.log(`metrics.service.successfullTxCount24hr`,error.message)
    throw error
  }
}



export async function totalVolumeOfframpToAmount() {
  // console.log("offramo",await OnRampTransaction.findAll())
  try{
    const result = await OffRampTransaction.sum('to_amount', {
      where: {
        status: 'SUCCESS'
      }
    });
  
    return result;

  }catch(error){
    console.log(`metrics.service.totalVolume`,error.message)
    throw error
  }
  
}


export async function totalVolumeOfframpFromAmount() {
  // console.log("offramo",await OnRampTransaction.findAll())
  try{
    const result = await OffRampTransaction.sum('from_amount', {
      where: {
        status: 'SUCCESS'
      }
    });
  
    return result;

  }catch(error){
    console.log(`metrics.service.totalVolume`,error.message)
    throw error
  }
  
}