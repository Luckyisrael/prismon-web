export interface App {
  id: string;
  name: string;
  apiKey: string;
  developerId: string;
  organizationId?: string;
  createdAt: string;
  programId?: string;
  deployedEndpoint?: string;
  deployedAt?: string;
}

export interface AppResponse {
  succeeded: boolean;
  message: string;
  id: string;
  name: string;
  apiKey: string;
  developerId: string;
  organizationId?: string;
  createdAt: string;
  programId?: string;
  deployedEndpoint?: string;
  deployedAt?: string;
}

export interface Analytics {
  appId: string;
  totalUsers: number;
  activeUsersLast24h: number;
  registrationsLast7d: number;
}

export interface AuthData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  succeeded: boolean;
  developerId: string;
  message: string;
  token?: string;
  isOnboardingCompleted?: boolean;
}

export interface SolanaBalance {
  balance: number;
}

export interface SolanaTokenAccount {
  mint: string;
  amount: number;
}

export interface SolanaTransferRequest {
  fromPublicKey: string;
  toPublicKey: string;
  amount: number;
  mint?: string;
}

export interface SolanaMintRequest {
  authorityPublicKey: string;
  mint: string;
  amount: number;
}

export interface SolanaSignatureResponse {
  signature: string;
}
