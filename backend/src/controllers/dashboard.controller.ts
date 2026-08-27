import type { Response, Request, NextFunction } from 'express';
import { calculateDashboardData, round2 } from '../services/dashboard.service.js';
import  TradingAccount  from '../models/TradingAccount.js';
import Trade from '../models/Trades.js';
import { Op } from 'sequelize';

// Composed Full Dashboard Endpoint
export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as { auth?: { userId: string } }).auth?.userId!;
    const { accountId } = req.params;

    const data = await calculateDashboardData((accountId as string), userId);
    res.status(200).json(data);
  } catch (error: any) {
    if (error.message === 'ACCOUNT_NOT_FOUND') {
      return res.status(404).json({ error: 'Trading account not found or access denied' });
    }
    next(error);
  }
};

// Standalone Performance Stats
export const getAccountStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as { auth?: { userId: string } }).auth?.userId!;
    const { accountId } = req.params;

    const data = await calculateDashboardData(accountId as string, userId);
    res.status(200).json({ stats: data.stats });
  } catch (error: any) {
    if (error.message === 'ACCOUNT_NOT_FOUND') {
      return res.status(404).json({ error: 'Trading account not found' });
    }
    next(error);
  }
};

// Standalone Equity Curve Sparkline
export const getEquityCurve = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as { auth?: { userId: string } }).auth?.userId!;
    const { accountId } = req.params;
    const range = (req.query.range as string) || 'all';

    const data = await calculateDashboardData(accountId as string, userId, range);
    res.status(200).json({
      range,
      points: data.equityCurve,
    });
  } catch (error: any) {
    if (error.message === 'ACCOUNT_NOT_FOUND') {
      return res.status(404).json({ error: 'Trading account not found' });
    }
    next(error);
  }
};

// List all user accounts (For Account Switcher)
export const getUserAccounts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as { auth?: { userId: string } }).auth?.userId!;
    const accounts = await TradingAccount.findAll({ where: { userId } });

    const accountIds = accounts.map((acc) => acc.id);

    const closedTrades = await Trade.findAll({
      where: {
        tradingAccountId: { [Op.in]: accountIds },
        outcome: { [Op.ne]: 'OPEN' },
      },
      order: [['closedAt', 'ASC']],
    });

    const tradesByAccount = new Map<string, typeof closedTrades>();
    for (const id of accountIds) {
      tradesByAccount.set(id, []);
    }
    for (const trade of closedTrades) {
      const list = tradesByAccount.get(trade.tradingAccountId);
      if (list) list.push(trade);
    }

    const accountList = accounts.map((acc) => {
      const trades = tradesByAccount.get(acc.id) || [];
      let totalPnL = 0;
      for (const trade of trades) {
        totalPnL += Number(trade.pnl) || 0;
      }
      const startingBalance = Number(acc.startingBalance) || 0;
      const currentBalance = startingBalance + totalPnL;
      const percentChange = startingBalance > 0 ? (totalPnL / startingBalance) * 100 : 0;

      return {
        id: acc.id,
        name: acc.accountName,
        market: acc.market,
        currency: acc.currency,
        currentBalance: round2(currentBalance),
        percentChange: round2(percentChange),
      };
    });

    res.status(200).json(accountList);
  } catch (error) {
    next(error);
  }
};