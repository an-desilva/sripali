import mongoose, { Schema, Document } from 'mongoose';
import { ISecuritySetting } from '@sripalie/types';

export interface ISecuritySettingDocument extends Omit<ISecuritySetting, '_id'>, Document {}

const SecuritySettingSchema: Schema = new Schema(
  {
    isLockdownMode: { type: Boolean, default: false },
    blacklistedIPs: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const SecuritySetting = mongoose.model<ISecuritySettingDocument>('SecuritySetting', SecuritySettingSchema);
