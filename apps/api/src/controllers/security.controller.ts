import { Request, Response } from 'express';
import { User } from '../models/User';
import { SecuritySetting } from '../models/SecuritySetting';

export const getSecurityStatus = async (req: Request, res: Response) => {
  try {
    let setting = await SecuritySetting.findOne();
    if (!setting) {
      setting = await SecuritySetting.create({ isLockdownMode: false, blacklistedIPs: [] });
    }
    return res.status(200).json(setting);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error fetching security status.' });
  }
};

export const getUsersList = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.status(200).json(users);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error fetching users list.' });
  }
};

export const revokeUserAccess = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { reason = 'Revoked by Administrator' } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.isBlocked = true;
    user.tokenVersion = (user.tokenVersion || 0) + 1; // Immediate session revocation
    user.blockedReason = reason;
    await user.save();

    return res.status(200).json({
      message: `User ${user.name} session revoked and access blocked immediately.`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isBlocked: user.isBlocked,
        tokenVersion: user.tokenVersion,
        blockedReason: user.blockedReason,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error revoking user access.' });
  }
};

export const unblockUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.isBlocked = false;
    user.blockedReason = '';
    await user.save();

    return res.status(200).json({ message: `User ${user.name} unblocked successfully.` });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error unblocking user.' });
  }
};

export const blacklistIP = async (req: Request, res: Response) => {
  try {
    const { ip } = req.body;
    if (!ip) {
      return res.status(400).json({ message: 'IP address is required.' });
    }

    let setting = await SecuritySetting.findOne();
    if (!setting) {
      setting = await SecuritySetting.create({ isLockdownMode: false, blacklistedIPs: [ip] });
    } else {
      if (!setting.blacklistedIPs.includes(ip)) {
        setting.blacklistedIPs.push(ip);
        await setting.save();
      }
    }

    return res.status(200).json({
      message: `IP address ${ip} added to blacklist successfully.`,
      blacklistedIPs: setting.blacklistedIPs,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error blacklisting IP.' });
  }
};

export const removeBlacklistedIP = async (req: Request, res: Response) => {
  try {
    const { ip } = req.body;
    let setting = await SecuritySetting.findOne();
    if (setting) {
      setting.blacklistedIPs = setting.blacklistedIPs.filter((item) => item !== ip);
      await setting.save();
    }
    return res.status(200).json({ message: `IP ${ip} removed from blacklist.`, setting });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error removing blacklisted IP.' });
  }
};

export const toggleLockdown = async (req: Request, res: Response) => {
  try {
    let setting = await SecuritySetting.findOne();
    if (!setting) {
      setting = await SecuritySetting.create({ isLockdownMode: true, blacklistedIPs: [] });
    } else {
      setting.isLockdownMode = !setting.isLockdownMode;
      await setting.save();
    }

    return res.status(200).json({
      message: `Emergency Store Lockdown is now ${setting.isLockdownMode ? 'ACTIVATED' : 'DEACTIVATED'}.`,
      isLockdownMode: setting.isLockdownMode,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error toggling store lockdown.' });
  }
};
