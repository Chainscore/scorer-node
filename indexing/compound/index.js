`{
    accounts(where: {id: "0x8aceab8167c80cb8b3de7fa6228b889bb1130ee8"}){
      tokens{
        symbol
        cTokenBalance
        market{
          underlyingPriceUSD
        }
        totalUnderlyingBorrowed
        totalUnderlyingRepaid
        totalUnderlyingSupplied
        totalUnderlyingRedeemed
        lifetimeBorrowInterestAccrued
      }
      health
      countLiquidated
      countLiquidator
      hasBorrowed
      totalBorrowValueInEth
      totalCollateralValueInEth
    }
    repayEvents(where: {borrower: "0x8ACeaB8167c80CB8b3DE7fa6228b889bB1130Ee8"}){
      amount
      accountBorrows
      blockTime
      underlyingSymbol
    }
    borrowEvents(where: {borrower: "0x8ACeaB8167c80CB8b3DE7fa6228b889bB1130Ee8"}){
      amount
      accountBorrows
      blockTime
      underlyingSymbol
    }
    liquidationEvents(where: {from: "0x8ACeaB8167c80CB8b3DE7fa6228b889bB1130Ee8"}){
      amount
      underlyingSymbol
      underlyingRepayAmount
    }
    redeemEvents(where: {from: "0x8ACeaB8167c80CB8b3DE7fa6228b889bB1130Ee8"}){
      amount
      cTokenSymbol
      underlyingAmount
    }
    mintEvents(where: {from: "0x8ACeaB8167c80CB8b3DE7fa6228b889bB1130Ee8"}){
      amount
      cTokenSymbol
      underlyingAmount
    }
  }`