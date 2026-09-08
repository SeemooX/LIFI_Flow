import { useState, useEffect, useRef } from "react";
import { ArrowRightLeft } from "lucide-react";
import { createClient } from '@lifi/sdk';
import { getRoutes } from '@lifi/sdk';
import Header from "./components/Header";
import HeroSectionTop from "./components/HerosectionTop";
import HeroSectionBottom from "./components/HeroSectionBottom";

const RAW_JSON = {
  id: "route_01j5kx7b2c9f8e3d",
  fromChainId: 1,
  toChainId: 137,
  fromToken: {
    symbol: "ETH",
    address: "0x0000000000000000000000000000000000000000",
    chainId: 1,
    decimals: 18,
    priceUSD: "1847.23",
  },
  toToken: {
    symbol: "USDC",
    address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    chainId: 137,
    decimals: 6,
    priceUSD: "1.00",
  },
  fromAmount: "1000000000000000000",
  toAmountMin: "1838000000",
  toAmountEstimate: "1847230000",
  slippage: 0.005,
  insurance: { state: "INSURED", feeAmountUsd: "0.12" },
  tags: ["CHEAPEST", "FASTEST"],
  steps: [
    {
      type: "swap", tool: "uniswap",
      toolDetails: { name: "Uniswap V3", key: "uniswap" },
      action: { fromChainId: 1, toChainId: 1, fromToken: "ETH", toToken: "USDC" },
      estimate: {
        fromAmount: "1000000000000000000",
        toAmount: "1850000000",
        gasCosts: [{ amount: "1820000000000000", token: "ETH", amountUSD: "1.82" }],
        executionDuration: 30,
        feeCosts: [],
      },
    },
    {
      type: "cross", tool: "stargate",
      toolDetails: { name: "Stargate", key: "stargate" },
      action: { fromChainId: 1, toChainId: 137, fromToken: "USDC", toToken: "USDC" },
      estimate: {
        fromAmount: "1850000000",
        toAmount: "1848000000",
        gasCosts: [{ amount: "1200000000000000", token: "ETH", amountUSD: "1.20" }],
        executionDuration: 210,
        feeCosts: [{ amount: "2000000", token: "USDC", amountUSD: "2.00", name: "Bridge Fee" }],
      },
    },
    {
      type: "swap", tool: "quickswap",
      toolDetails: { name: "QuickSwap", key: "quickswap" },
      action: { fromChainId: 137, toChainId: 137, fromToken: "USDC", toToken: "USDC" },
      estimate: {
        fromAmount: "1848000000",
        toAmount: "1847230000",
        gasCosts: [{ amount: "40000000000000", token: "MATIC", amountUSD: "0.40" }],
        executionDuration: 32,
        feeCosts: [],
      },
    },
  ],
};

const LOADING_MESSAGES = [
  "Scanning 40+ bridges…",
  "Comparing liquidity pools…",
  "Evaluating gas costs…",
  "Checking slippage tolerance…",
  "Optimizing execution path…",
  "Route found ✓",
];

function Divider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="flex-1 h-px bg-border" />
      {label && <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{label}</span>}
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

export default function App() {

  // Result state
  const [loading, setLoading] = useState<boolean>(false);
  const [loadMsg, setLoadMsg] = useState<string>("");
  const [routeReady, setRouteReady] = useState<boolean>(false);
  const [devTab, setDevTab] = useState<"summary" | "json">("summary");

  const msgIdxRef = useRef(0);

  // Sync tokens when chain changes
  useEffect(() => {
    const lifi = async () => {
      const client = createClient({
        integrator: 'CinemaNova',
      });

      const routesRequest = {
        fromChainId: 42161, // Arbitrum
        toChainId: 10, // Optimism
        fromTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // USDC on Arbitrum
        toTokenAddress: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', // DAI on Optimism
        fromAmount: '10000000', // 10 USDC
      };

      const result = await getRoutes(client, routesRequest);
      const routes = result.routes;

      /* const blob = new Blob(
        [JSON.stringify(routes, null, 2)],
        { type: "application/json" }
      );

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "routes.json";
      a.click();

      URL.revokeObjectURL(url); */

      console.log("Routes saved!");

    }

    lifi();
  }, []);

  /* useEffect(() => {
    const tokens = TOKENS[dstChain] ?? [];
    if (!tokens.includes(dstToken)) setDstToken(tokens[0] ?? "");
  }, [dstChain]); */

  const handleFind = () => {
    setLoading(true);
    setRouteReady(false);
    msgIdxRef.current = 0;
    setLoadMsg(LOADING_MESSAGES[0]);

    const interval = setInterval(() => {
      msgIdxRef.current += 1;
      if (msgIdxRef.current < LOADING_MESSAGES.length) {
        setLoadMsg(LOADING_MESSAGES[msgIdxRef.current]);
      }
      if (msgIdxRef.current >= LOADING_MESSAGES.length - 1) {
        clearInterval(interval);
        setTimeout(() => {
          setLoading(false);
          setRouteReady(true);
        }, 400);
      }
    }, 260);
  };

  const handleReset = () => {
    setRouteReady(false);
    setDevTab("summary");
  };

  const jsonStr = JSON.stringify(RAW_JSON, null, 2);

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: '"Geist", system-ui, sans-serif' }}>

      {/* ── Ambient ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div style={{
          position: "absolute", top: "-20%", left: "30%",
          width: "60vw", height: "60vh",
          background: "radial-gradient(ellipse, rgba(124,106,255,0.06) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute", bottom: "-10%", right: "10%",
          width: "50vw", height: "50vh",
          background: "radial-gradient(ellipse, rgba(18,170,255,0.04) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />
      </div>

      {/* ── Header ── */}
      <Header/>

      {/* ── Page ── */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Hero heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-1.5">
            Route Explorer
          </h1>
          <p className="text-sm text-muted-foreground">
            Explore optimal cross-chain routes using the LI.FI SDK.{" "}
            <span style={{ color: "#7c6aff" }}>Scan 40+ bridges and DEXs instantly.</span>
          </p>
        </div>

        {/* The top part of the Herosection */}
        <HeroSectionTop routeReady={routeReady} handleFind={handleFind} handleReset={handleReset} loading={loading} loadMsg={loadMsg} />

        {/* The Bottom part of the Herosection */}
        {routeReady && <HeroSectionBottom/>}

        {/* ── Empty state ── */}
        {!routeReady && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-2xl border border-border flex items-center justify-center mb-4"
              style={{ background: "rgba(124,106,255,0.08)" }}>
              <ArrowRightLeft className="w-5 h-5" style={{ color: "rgba(124,106,255,0.5)" }} />
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Configure source and destination chains above,
              then click <span className="text-foreground/50 font-medium">Find Best Route</span> to
              evaluate paths across all supported bridges and DEXs.
            </p>
          </div>
        )}
      </div>

      {/* Syntax highlight styles */}
      <style>{`
        .jk { color: #93c5fd; }
        .js { color: #86efac; }
        .ji { color: #fde68a; }
        .jb { color: #d8b4fe; }
        .jn { color: #fca5a5; }
        select option { background: #141929 !important; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.10); }
      `}</style>
    </div>
  );
}
