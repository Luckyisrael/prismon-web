import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSolanaBalance, getSolanaTokenAccounts, transferSolana, mintSolana, getTransactionDetails } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ArrowRightLeft, Plus, Search, Loader2 } from "lucide-react";

export default function SolanaTools() {
  const [balanceAddress, setBalanceAddress] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [txSignature, setTxSignature] = useState("");
  const [transferData, setTransferData] = useState({
    fromPublicKey: "",
    toPublicKey: "",
    amount: 0,
    mint: "",
  });
  const [mintData, setMintData] = useState({
    authorityPublicKey: "",
    mint: "",
    amount: 0,
  });
  
  const [balanceResult, setBalanceResult] = useState<null | { balance: number }>(null);
  const [tokenResult, setTokenResult] = useState<null | any[]>(null);
  const [transactionResult, setTransactionResult] = useState<null | any>(null);
  
  const { toast } = useToast();
  
  // Balance check mutation
  const balanceMutation = useMutation({
    mutationFn: getSolanaBalance,
    onSuccess: (data) => {
      setBalanceResult(data);
      toast({
        title: "Balance Retrieved",
        description: `Balance: ${data.balance} lamports`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Could not fetch balance",
        variant: "destructive",
      });
    },
  });
  
  // Token accounts mutation
  const tokenAccountsMutation = useMutation({
    mutationFn: getSolanaTokenAccounts,
    onSuccess: (data) => {
      setTokenResult(data);
      toast({
        title: "Token Accounts Retrieved",
        description: `Found ${data.length} token accounts`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Could not fetch token accounts",
        variant: "destructive",
      });
    },
  });
  
  // Transfer mutation
  const transferMutation = useMutation({
    mutationFn: transferSolana,
    onSuccess: (data) => {
      toast({
        title: "Transfer Successful",
        description: `Transaction signature: ${data.signature.substring(0, 10)}...`,
      });
    },
    onError: (error) => {
      toast({
        title: "Transfer Failed",
        description: error instanceof Error ? error.message : "Could not complete transfer",
        variant: "destructive",
      });
    },
  });
  
  // Mint mutation
  const mintMutation = useMutation({
    mutationFn: mintSolana,
    onSuccess: (data) => {
      toast({
        title: "Mint Successful",
        description: `Transaction signature: ${data.signature.substring(0, 10)}...`,
      });
    },
    onError: (error) => {
      toast({
        title: "Mint Failed",
        description: error instanceof Error ? error.message : "Could not complete minting",
        variant: "destructive",
      });
    },
  });
  
  // Transaction details mutation
  const transactionMutation = useMutation({
    mutationFn: getTransactionDetails,
    onSuccess: (data) => {
      setTransactionResult(data);
      toast({
        title: "Transaction Details Retrieved",
        description: "Transaction details loaded successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Could not fetch transaction details",
        variant: "destructive",
      });
    },
  });
  
  // Handlers
  const handleCheckBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!balanceAddress.trim()) {
      toast({
        title: "Validation Error",
        description: "Public key is required",
        variant: "destructive",
      });
      return;
    }
    balanceMutation.mutate(balanceAddress);
  };
  
  const handleCheckTokens = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenAddress.trim()) {
      toast({
        title: "Validation Error",
        description: "Public key is required",
        variant: "destructive",
      });
      return;
    }
    tokenAccountsMutation.mutate(tokenAddress);
  };
  
  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferData.fromPublicKey.trim() || !transferData.toPublicKey.trim() || transferData.amount <= 0) {
      toast({
        title: "Validation Error",
        description: "From address, to address, and amount are required",
        variant: "destructive",
      });
      return;
    }
    transferMutation.mutate(transferData);
  };
  
  const handleMint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mintData.authorityPublicKey.trim() || !mintData.mint.trim() || mintData.amount <= 0) {
      toast({
        title: "Validation Error",
        description: "Authority address, mint address, and amount are required",
        variant: "destructive",
      });
      return;
    }
    mintMutation.mutate(mintData);
  };
  
  const handleLookupTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txSignature.trim()) {
      toast({
        title: "Validation Error",
        description: "Transaction signature is required",
        variant: "destructive",
      });
      return;
    }
    transactionMutation.mutate(txSignature);
  };
  
  return (
    <AppShell>
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Solana Tools</h1>
          <p className="text-slate-400 mt-1">Tools for interacting with the Solana blockchain</p>
        </div>
        
        {/* Solana Tools Tabs */}
        <Tabs defaultValue="balance" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700 text-slate-400">
            <TabsTrigger value="balance">Check Balance</TabsTrigger>
            <TabsTrigger value="tokens">Token Accounts</TabsTrigger>
            <TabsTrigger value="transfer">Transfer</TabsTrigger>
            <TabsTrigger value="mint">Mint</TabsTrigger>
            <TabsTrigger value="transactions">Lookup Transaction</TabsTrigger>
          </TabsList>
          
          {/* Balance Tab */}
          <TabsContent value="balance">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle>Check SOL Balance</CardTitle>
                <CardDescription className="text-slate-400">
                  Get the SOL balance for any Solana address
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCheckBalance} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="balance-address" className="text-slate-300">Public Key</Label>
                    <Input
                      id="balance-address"
                      placeholder="Enter Solana address"
                      className="bg-slate-800 border-slate-700 text-white"
                      value={balanceAddress}
                      onChange={(e) => setBalanceAddress(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={balanceMutation.isPending}
                    className="w-full"
                  >
                    {balanceMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Check Balance
                      </>
                    )}
                  </Button>
                </form>
                
                {balanceResult && (
                  <div className="mt-6 p-4 bg-slate-800 rounded-md border border-slate-700">
                    <h3 className="font-medium text-white mb-2">Balance Result</h3>
                    <div className="text-sm text-slate-300">
                      <p><span className="font-medium">SOL:</span> {balanceResult.balance / 1000000000}</p>
                      <p><span className="font-medium">Lamports:</span> {balanceResult.balance}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Token Accounts Tab */}
          <TabsContent value="tokens">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle>Token Accounts</CardTitle>
                <CardDescription className="text-slate-400">
                  Get all token accounts for a Solana address
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCheckTokens} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="token-address" className="text-slate-300">Public Key</Label>
                    <Input
                      id="token-address"
                      placeholder="Enter Solana address"
                      className="bg-slate-800 border-slate-700 text-white"
                      value={tokenAddress}
                      onChange={(e) => setTokenAddress(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={tokenAccountsMutation.isPending}
                    className="w-full"
                  >
                    {tokenAccountsMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Get Token Accounts
                      </>
                    )}
                  </Button>
                </form>
                
                {tokenResult && (
                  <div className="mt-6 p-4 bg-slate-800 rounded-md border border-slate-700">
                    <h3 className="font-medium text-white mb-2">Token Accounts ({tokenResult.length})</h3>
                    <div className="text-sm text-slate-300 space-y-2 max-h-60 overflow-y-auto">
                      {tokenResult.length === 0 ? (
                        <p>No token accounts found</p>
                      ) : (
                        tokenResult.map((token, index) => (
                          <div key={index} className="p-2 border-b border-slate-700 last:border-0">
                            <p><span className="font-medium">Mint:</span> {token.mint.substring(0, 10)}...</p>
                            <p><span className="font-medium">Amount:</span> {token.amount}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Transfer Tab */}
          <TabsContent value="transfer">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle>Transfer SOL or Tokens</CardTitle>
                <CardDescription className="text-slate-400">
                  Transfer SOL or tokens from one address to another
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTransfer} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="from-address" className="text-slate-300">From Public Key</Label>
                    <Input
                      id="from-address"
                      placeholder="Sender's Solana address"
                      className="bg-slate-800 border-slate-700 text-white"
                      value={transferData.fromPublicKey}
                      onChange={(e) => setTransferData({...transferData, fromPublicKey: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="to-address" className="text-slate-300">To Public Key</Label>
                    <Input
                      id="to-address"
                      placeholder="Recipient's Solana address"
                      className="bg-slate-800 border-slate-700 text-white"
                      value={transferData.toPublicKey}
                      onChange={(e) => setTransferData({...transferData, toPublicKey: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="transfer-amount" className="text-slate-300">Amount</Label>
                    <Input
                      id="transfer-amount"
                      type="number"
                      placeholder="Amount to transfer"
                      className="bg-slate-800 border-slate-700 text-white"
                      value={transferData.amount || ""}
                      onChange={(e) => setTransferData({...transferData, amount: parseFloat(e.target.value)})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mint-address" className="text-slate-300">
                      Mint Address (Optional, leave empty for SOL)
                    </Label>
                    <Input
                      id="mint-address"
                      placeholder="Token mint address"
                      className="bg-slate-800 border-slate-700 text-white"
                      value={transferData.mint}
                      onChange={(e) => setTransferData({...transferData, mint: e.target.value})}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={transferMutation.isPending}
                    className="w-full"
                  >
                    {transferMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ArrowRightLeft className="mr-2 h-4 w-4" />
                        Transfer
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Mint Tab */}
          <TabsContent value="mint">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle>Mint Tokens</CardTitle>
                <CardDescription className="text-slate-400">
                  Mint new tokens for an existing token mint
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleMint} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="authority-address" className="text-slate-300">Authority Public Key</Label>
                    <Input
                      id="authority-address"
                      placeholder="Mint authority address"
                      className="bg-slate-800 border-slate-700 text-white"
                      value={mintData.authorityPublicKey}
                      onChange={(e) => setMintData({...mintData, authorityPublicKey: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mint-token-address" className="text-slate-300">Mint Address</Label>
                    <Input
                      id="mint-token-address"
                      placeholder="Token mint address"
                      className="bg-slate-800 border-slate-700 text-white"
                      value={mintData.mint}
                      onChange={(e) => setMintData({...mintData, mint: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mint-amount" className="text-slate-300">Amount</Label>
                    <Input
                      id="mint-amount"
                      type="number"
                      placeholder="Amount to mint"
                      className="bg-slate-800 border-slate-700 text-white"
                      value={mintData.amount || ""}
                      onChange={(e) => setMintData({...mintData, amount: parseFloat(e.target.value)})}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={mintMutation.isPending}
                    className="w-full"
                  >
                    {mintMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Mint Tokens
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle>Lookup Transaction</CardTitle>
                <CardDescription className="text-slate-400">
                  Get details for a transaction by signature
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLookupTransaction} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tx-signature" className="text-slate-300">Transaction Signature</Label>
                    <Input
                      id="tx-signature"
                      placeholder="Enter transaction signature"
                      className="bg-slate-800 border-slate-700 text-white"
                      value={txSignature}
                      onChange={(e) => setTxSignature(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={transactionMutation.isPending}
                    className="w-full"
                  >
                    {transactionMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Looking up...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Lookup Transaction
                      </>
                    )}
                  </Button>
                </form>
                
                {transactionResult && (
                  <div className="mt-6 p-4 bg-slate-800 rounded-md border border-slate-700">
                    <h3 className="font-medium text-white mb-2">Transaction Details</h3>
                    <div className="text-sm text-slate-300 space-y-1 max-h-80 overflow-y-auto">
                      <pre className="whitespace-pre-wrap break-words">
                        {JSON.stringify(transactionResult, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
