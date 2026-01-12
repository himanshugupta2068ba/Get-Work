import express from 'express';
import mongoose from 'mongoose';
import Bid from '../models/Bid.js';
import Gig from '../models/Gig.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Submit a bid for a gig
router.post('/', authenticate, async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    if (!gigId || !message || price === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if gig exists and is open
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.status !== 'open') {
      return res.status(400).json({ message: 'Gig is no longer open for bidding' });
    }

    // Check if user already bid on this gig
    const existingBid = await Bid.findOne({
      gigId,
      freelancerId: req.userId
    });

    if (existingBid) {
      return res.status(400).json({ message: 'You have already bid on this gig' });
    }

    // Create bid
    const bid = new Bid({
      gigId,
      freelancerId: req.userId,
      message,
      price
    });

    await bid.save();
    await bid.populate('freelancerId', 'name email');

    res.status(201).json(bid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all bids for a specific gig (Owner only)
router.get('/:gigId', authenticate, async (req, res) => {
  try {
    const { gigId } = req.params;

    // Check if gig exists
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Check if user is the owner
    if (gig.ownerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only the gig owner can view bids' });
    }

    const bids = await Bid.find({ gigId })
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Hire a freelancer (with transactional integrity - Bonus 1)
router.patch('/:bidId/hire', authenticate, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bidId } = req.params;

    // Find the bid
    const bid = await Bid.findById(bidId).session(session);
    if (!bid) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Bid not found' });
    }

    // Find the gig
    const gig = await Gig.findById(bid.gigId).session(session);
    if (!gig) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Check if user is the owner
    if (gig.ownerId.toString() !== req.userId) {
      await session.abortTransaction();
      return res.status(403).json({ message: 'Only the gig owner can hire freelancers' });
    }

    // Check if gig is still open (atomic check)
    if (gig.status !== 'open') {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Gig is no longer open for hiring' });
    }

    // Check if bid is still pending
    if (bid.status !== 'pending') {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Bid is no longer available' });
    }

    // Atomic update: Change gig status to assigned
    const gigUpdateResult = await Gig.updateOne(
      { _id: gig._id, status: 'open' }, // Only update if still open (prevents race condition)
      { $set: { status: 'assigned' } },
      { session }
    );

    if (gigUpdateResult.matchedCount === 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Gig status changed. Please refresh and try again.' });
    }

    // Mark chosen bid as hired
    bid.status = 'hired';
    await bid.save({ session });

    // Mark all other bids for this gig as rejected
    await Bid.updateMany(
      { gigId: gig._id, _id: { $ne: bidId }, status: 'pending' },
      { $set: { status: 'rejected' } },
      { session }
    );

    await session.commitTransaction();

    // Emit real-time notification (Bonus 2)
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${bid.freelancerId.toString()}`).emit('hired', {
        message: `You have been hired for "${gig.title}"!`,
        gigId: gig._id,
        gigTitle: gig.title
      });
    }

    await bid.populate('freelancerId', 'name email');
    await gig.populate('ownerId', 'name email');

    res.json({
      message: 'Freelancer hired successfully',
      bid,
      gig
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

// Get user's bids
router.get('/user/my-bids', authenticate, async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerId: req.userId })
      .populate('gigId', 'title description budget status')
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's posted gigs
router.get('/user/my-gigs', authenticate, async (req, res) => {
  try {
    const gigs = await Gig.find({ ownerId: req.userId })
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

