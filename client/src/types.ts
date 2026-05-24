/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProfileInfo {
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
  avatarPreset: string; // 'emerald' | 'gold' | 'sapphire' | 'custom'
  instaPayAddress: string; // Recipient address, e.g. owner@instapay
  instaPayEmail: string; // Recipient backup email
}

export interface LinkItem {
  id: string;
  title: string;
  subtitle?: string; // Optional subtitle descriptor
  url: string;
  iconName: string; // lucide icon identifier
  clicks: number;
  colorPreset: string; // e.g., 'emerald', 'indigo', 'gold', 'carbon'
  isActive: boolean;
}

export interface PaymentTransaction {
  id: string; // hash
  senderAddress: string; // sender's instapay address or email
  receiverAddress: string; // recipient address
  amount: number;
  timestamp: string;
  status: 'PENDING' | 'VERIFIED' | 'FAILED';
  verificationCode: string; // 8-char secure verification code
  receiptUrl?: string; // uploaded image
  purpose?: string;
}

export interface SecurityStatus {
  sslActive: boolean;
  tamperProtection: boolean;
  encryptionKey: string;
}
