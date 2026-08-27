import type { Request, Response, NextFunction } from 'express';
import Trade from '../models/Trades.js';
import TradeScreenshot from '../models/TradeScreenshot.js';
import  TradingAccount  from '../models/TradingAccount.js';
import cloudinary from '../config/cloudinary.config.js';

export const uploadScreenshot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as { auth?: { userId: string } }).auth?.userId;
    const { tradeId } = req.params;
    const { caption, screenshotType } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Please upload an image file' });
    }
    // 1. Verify trade existence and user ownership
    const trade = await Trade.findOne({
      where: { id: tradeId },
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

    // 2. Upload memory buffer directly to Cloudinary
    // upload buffer to cloudinary using upload with a data URI
    const b64 = req.file.buffer.toString("base64");// convert buffer to base64
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;// create data URI from base64 string
    const result = await cloudinary.uploader.upload(dataURI, {
    folder: "trading_journal/screenshots",
    });
    const imageUrl = result.secure_url;
    const public_id= result.public_id;

    // 3. Save Cloudinary URL and publicId to database
    let screenshot;
    try {
      screenshot = await TradeScreenshot.create({
        tradeId,
        url: imageUrl,
        publicId: public_id,
        screenshotType,
        caption: caption || null,
      });
    } catch (error) {
      await cloudinary.uploader.destroy(public_id);
      next(error);
    }

    res.status(201).json({
      message: 'Screenshot uploaded successfully',
      screenshot,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteScreenshot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as { auth?: { userId: string } }).auth?.userId;
    const { tradeId, id } = req.params;

    // Verify ownership through Trade -> TradingAccount chain
    const screenshot = await TradeScreenshot.findOne({
      where: { id },
      include: [
        {
          model: Trade,
          as: 'trade',
          where: { id: tradeId },
          include: [
            {
              model: TradingAccount,
              as: 'tradingAccount',
              where: { userId },
            },
          ],
        },
      ],
    });

    if (!screenshot) {
      return res.status(404).json({ error: 'Screenshot not found or access denied' });
    }

    // 1. Delete image asset from Cloudinary using publicId
    await cloudinary.uploader.destroy(screenshot.publicId);

    // 2. Remove record from database
    await screenshot.destroy();

    res.status(200).json({ message: 'Screenshot deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getTradeScreenshots = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as { auth?: { userId: string } }).auth?.userId;
    const { tradeId } = req.params;

    // 1. Verify Trade existence and User Ownership
    const trade = await Trade.findOne({
      where: { id: tradeId },
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

    // 2. Fetch all screenshots associated with this trade
    const screenshots = await TradeScreenshot.findAll({
      where: { tradeId },
      order: [['createdAt', 'ASC']],
    });

    // 3. Group by BEFORE and AFTER for mobile web rendering
    const before = screenshots.filter((s) => s.screenshotType === 'BEFORE');
    const after = screenshots.filter((s) => s.screenshotType === 'AFTER');

    res.status(200).json({
      tradeId,
      totalCount: screenshots.length,
      before,
      after,
    });
  } catch (error) {
    next(error);
  }
};