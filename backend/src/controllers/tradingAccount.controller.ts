import type { Request, Response, NextFunction } from 'express';
import  TradingAccount  from '../models/TradingAccount.js';
import { Op } from 'sequelize';

export const createTradingAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as { auth?: { userId: string } }).auth?.userId;
    const { accountName, market, accountType, startingBalance, currency } = req.body;

    // Optional: Check for duplicate account names per user
    const existingAccount = await TradingAccount.findOne({
      where: { userId, accountName },
    });

    if (existingAccount) {
      return res.status(400).json({ error: 'An account with this name already exists' });
    }

    const account = await TradingAccount.create({
      userId: userId!,
      accountName,
      market,
      accountType,
      startingBalance: startingBalance || 0.0,
      currency: currency || 'USD',
    });

    res.status(201).json({
      message: 'Trading account created successfully',
      account,
    });
  } catch (error) {
    next(error);
  }
};

// Fetch All Trading Accounts Belonging to Authenticated User
export const getAllTradingAccounts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as { auth?: { userId: string } }).auth?.userId;

    const accounts = await TradingAccount.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      count: accounts.length,
      accounts,
    });
  } catch (error) {
    next(error);
  }
};

// Fetch Single Trading Account by ID (Ensuring Ownership)
export const getTradingAccountById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as { auth?: { userId: string } }).auth?.userId;
    const { id } = req.params;

    const account = await TradingAccount.findOne({
      where: { id, userId }, // Must match both account ID and current user ID
    });

    if (!account) {
      return res.status(404).json({ error: 'Trading account not found' });
    }

    res.status(200).json({ account });
  } catch (error) {
    next(error);
  }
};

export const updateTradingAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as { auth?: { userId: string } }).auth?.userId;
    const { id } = req.params;
    const { accountName, market, accountType, startingBalance, currency } = req.body;

    const account = await TradingAccount.findOne({
      where: { id, userId },
    });

    if (!account) {
      return res.status(404).json({ error: 'Trading account not found' });
    }

    // Check for unique account name if updating name
    if (accountName && accountName !== account.accountName) {
      const existingName = await TradingAccount.findOne({
        where: {
          userId,
          accountName,
          id: { [Op.ne]: id },
        },
      });

      if (existingName) {
        return res.status(400).json({ error: 'An account with this name already exists' });
      }
    }

    // Apply updates
    if (accountName) account.accountName = accountName;
    if (market) account.market = market;
    if (accountType) account.accountType = accountType;
    if (startingBalance !== undefined) account.startingBalance = startingBalance;
    if (currency) account.currency = currency;

    await account.save();

    res.status(200).json({
      message: 'Trading account updated successfully',
      account,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Trading Account
export const deleteTradingAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as { auth?: { userId: string } }).auth?.userId;
    const { id } = req.params;

    const account = await TradingAccount.findOne({
      where: { id, userId },
    });

    if (!account) {
      return res.status(404).json({ error: 'Trading account not found' });
    }

    await account.destroy();

    res.status(200).json({ message: 'Trading account deleted successfully' });
  } catch (error) {
    next(error);
  }
};