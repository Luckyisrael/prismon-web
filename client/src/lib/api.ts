import { AppResponse, Analytics, SolanaBalance, SolanaTokenAccount, SolanaTransferRequest, SolanaMintRequest, SolanaSignatureResponse } from "@/types";
import { API_BASE_URL, apiRequest } from "./queryClient";
import { getAuthHeader } from "./auth";

// App Management APIs
export async function createApp(name: string): Promise<AppResponse> {
  const response = await apiRequest("POST", `${API_BASE_URL}/apps`, { name }, getAuthHeader());
  return await response.json();
}

export async function getApps(): Promise<AppResponse[]> {
  const response = await apiRequest("GET", `${API_BASE_URL}/apps`, undefined, getAuthHeader());
  console.log(response);
  return await response.json();
}

export async function updateApp(appId: string, name: string): Promise<AppResponse> {
  const response = await apiRequest("PUT", `${API_BASE_URL}/apps/${appId}`, { name }, getAuthHeader());
  return await response.json();
}

export async function deleteApp(appId: string): Promise<AppResponse> {
  const response = await apiRequest("DELETE", `${API_BASE_URL}/apps/${appId}`, undefined, getAuthHeader());
  return await response.json();
}

export async function regenerateAppKey(appId: string): Promise<AppResponse> {
  const response = await apiRequest("POST", `${API_BASE_URL}/apps/${appId}/regenerate-key`, undefined, getAuthHeader());
  return await response.json();
}

// Analytics APIs
export async function getUserAnalytics(appId: string): Promise<Analytics> {
  const response = await apiRequest("GET", `${API_BASE_URL}/analytics/users?appId=${appId}`, undefined, getAuthHeader());
  console.log('analytics', response);
  return await response.json();
}

// Solana APIs (Optional)
export async function getSolanaBalance(publicKey: string): Promise<SolanaBalance> {
  const response = await apiRequest("GET", `${API_BASE_URL}/solana/balance?publicKey=${publicKey}`, undefined, getAuthHeader());
  return await response.json();
}

export async function getSolanaTokenAccounts(publicKey: string): Promise<SolanaTokenAccount[]> {
  const response = await apiRequest("GET", `${API_BASE_URL}/solana/token-accounts?publicKey=${publicKey}`, undefined, getAuthHeader());
  return await response.json();
}

export async function transferSolana(transferData: SolanaTransferRequest): Promise<SolanaSignatureResponse> {
  const response = await apiRequest("POST", `${API_BASE_URL}/solana/transfer`, transferData, getAuthHeader());
  return await response.json();
}

export async function mintSolana(mintData: SolanaMintRequest): Promise<SolanaSignatureResponse> {
  const response = await apiRequest("POST", `${API_BASE_URL}/solana/mint`, mintData, getAuthHeader());
  return await response.json();
}

export async function getTransactionDetails(signature: string): Promise<any> {
  const response = await apiRequest("GET", `${API_BASE_URL}/solana/transaction?signature=${signature}`, undefined, getAuthHeader());
  return await response.json();
}

// Plan upgrade API
export async function upgradePlan(planData: { tier: string; customRateLimit?: number; currency: string }): Promise<any> {
  const response = await apiRequest("POST", `${API_BASE_URL}/Apps/upgrade`, planData, getAuthHeader());
  return await response.json();
}
