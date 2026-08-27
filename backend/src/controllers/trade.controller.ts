import type { Response, Request, NextFunction } from 'express';
import Trade from '../models/Trades.js';
import  TradingAccount  from '../models/TradingAccount.js';

export const createTrade = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as { auth?: { userId: string } }).auth?.userId;
    const {
      tradingAccountId,
      symbol,
      direction,
      confluence,
      outcome,
      pnl,
      openedAt,
      closedAt,
      notes,
    } = req.body;

    // 🔒 Multi-Account Isolation:
    // Verify trading account exists AND belongs to the authenticated user
    const account = await TradingAccount.findOne({
      where: { id: tradingAccountId, userId },
    });

    if (!account) {
      return res.status(404).json({
        error: 'Trading account not found or does not belong to you',
      });
    }

    // Create trade linked to the verified trading account
    const trade = await Trade.create({
      tradingAccountId,
      symbol,
      direction,
      confluence: confluence || null,
      outcome: outcome || 'OPEN',
      pnl: pnl || 0.0,
      openedAt: openedAt || new Date(),
      closedAt: closedAt || null,
      notes: notes || null,
    });

    res.status(201).json({
      message: 'Trade created successfully',
      trade,
    });
  } catch (error) {
    next(error);
  }
};

export const getTrades = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as { auth?: { userId: string } }).auth?.userId;
    const { tradingAccountId, page = 1, limit = 10, symbol, direction, outcome } = req.query;

    // 1. Verify the requested trading account exists AND belongs to the authenticated user
    const account = await TradingAccount.findOne({
      where: { id: tradingAccountId, userId },
    });

    if (!account) {
      return res.status(404).json({
        error: 'Trading account not found or access denied',
      });
    }

    // 2. Fetch trades belonging strictly to THIS validated account
    const offset = (Number(page) - 1) * Number(limit);
    const whereClause: Record<string, any> = {
      tradingAccountId: tradingAccountId, // Scope trades ONLY to this account
    };// where the trade, belongs to the current(opened) trading account

    if (symbol) whereClause.symbol = symbol;
    if (direction) whereClause.direction = direction;
    if (outcome) whereClause.outcome = outcome;

    const { count, rows: trades } = await Trade.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset,
      order: [['openedAt', 'DESC']],
    });

    res.status(200).json({
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / Number(limit)),
        currentPage: Number(page),
        itemsPerPage: Number(limit),
      },
      trades,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Trade by ID (Ensuring Ownership)
export const getTradeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as { auth?: { userId: string } }).auth?.userId;
    const { id } = req.params;

    const trade = await Trade.findOne({
      where: { id },
      include: [
        {
          model: TradingAccount,
          as: 'tradingAccount',
          where: { userId },
          attributes: ['id', 'accountName', 'market', 'currency'],
        },
      ],
    });

    if (!trade) {
      return res.status(404).json({ error: 'Trade not found' });
    }

    res.status(200).json({ trade });
  } catch (error) {
    next(error);
  }
};

// Update & Close Trade
export const updateTrade = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as { auth?: { userId: string } }).auth?.userId;
    const { id } = req.params;
    const updates = req.body;

    // 1. Ownership & Existence Guard (via associated TradingAccount)
    const trade = await Trade.findOne({
      where: { id },
      include: [
        {
          model: TradingAccount,
          as: 'tradingAccount',
          where: { userId },
        },
      ],
    });

    if (!trade) {
      return res.status(404).json({ error: 'Trade not found or access denied' });
    }

    // 2. Business Logic: Handle Outcome & Timestamp State Transitions
    if (updates.outcome) {
      if (updates.outcome === 'OPEN') {
        // Re-opening trade: reset closedAt and PnL
        updates.closedAt = null;
        updates.pnl = 0.0;
      } else if (trade.outcome === 'OPEN' && !updates.closedAt) {
        // Closing an OPEN trade without explicit closedAt timestamp: default to now
        updates.closedAt = new Date();
      }
    }

    // 3. Apply updates and save
    await trade.update(updates);

    res.status(200).json({
      message: 'Trade updated successfully',
      trade,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Trade
export const deleteTrade = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as { auth?: { userId: string } }).auth?.userId;
    const { id } = req.params;

    const trade = await Trade.findOne({
      where: { id },
      include: [
        {
          model: TradingAccount,
          as: 'tradingAccount',
          where: { userId },
        },
      ],
    });

    if (!trade) {
      return res.status(404).json({ error: 'Trade not found or access denied' });
    }

    await trade.destroy();

    res.status(200).json({ message: 'Trade deleted successfully' });
  } catch (error) {
    next(error);
  }
};