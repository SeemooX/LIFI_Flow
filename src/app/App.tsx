import { useState } from "react";
import { ArrowRightLeft } from "lucide-react";
/* import { createClient, getRoutes } from '@lifi/sdk'; */
import Header from "./components/Header";
import HeroSectionTop from "./components/HerosectionTop";
import HeroSectionBottom from "./components/HeroSectionBottom";
import { CHAIN_MAP } from "../config/chains";
import { findRoutes } from "../services/lifi";
import { parseUnits } from "ethers";
import type { RouteStep } from "../types/appTypes";

/* function Divider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="flex-1 h-px bg-border" />
      {label && <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{label}</span>}
      <div className="flex-1 h-px bg-border" />
    </div>
  );
} */

export default function App() {
  // Result state
  const [routes, setRoutes] = useState<RouteStep[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadMsg, setLoadMsg] = useState<string>("");
  const [routeReady, setRouteReady] = useState<boolean>(false);
  const [devTab, setDevTab] = useState<"summary" | "json">("summary");

  // Form state
  const [srcChain, setSrcChain] = useState("eth");
  const [srcToken, setSrcToken] = useState("ETH");
  const [amount, setAmount] = useState("1.0");
  const [dstChain, setDstChain] = useState("pol");
  const [dstToken, setDstToken] = useState("USDC");

  // Sync tokens when chain changes
 /*  useEffect(() => {
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
      console.log(routes); */

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

     /*  console.log("Routes saved!");
    }

    lifi();
  }, []); */

  /* useEffect(() => {
    const tokens = TOKENS[dstChain] ?? [];
    if (!tokens.includes(dstToken)) setDstToken(tokens[0] ?? "");
  }, [dstChain]); */

 /*  const handleFind = async () => {
    const sourceChain = CHAIN_MAP[srcChain];
    const destinationChain = CHAIN_MAP[dstChain];

    const sourceToken = sourceChain.tokens.find(
      (token) => token.symbol === srcToken
    );

    const destinationToken = destinationChain.tokens.find(
      (token) => token.symbol === dstToken
    );

    if (!sourceToken || !destinationToken) {
      console.error("Token not found");
      return;
    }

    console.log({
      fromChainId: sourceChain.chainId,
      toChainId: destinationChain.chainId,
      fromTokenAddress: sourceToken.address,
      toTokenAddress: destinationToken.address,
    });
  } */;


  const handleFind = async () => {
    try {
      setLoading(true);
      setRouteReady(false);
      setLoadMsg("Finding best route...");

      const sourceChain = CHAIN_MAP[srcChain];
      const destinationChain = CHAIN_MAP[dstChain];

      if (!sourceChain || !destinationChain) {
        throw new Error("Invalid chain selected");
      }

      const sourceToken = sourceChain.tokens.find(
        (token) => token.symbol === srcToken
      );

      const destinationToken = destinationChain.tokens.find(
        (token) => token.symbol === dstToken
      );

      if (!sourceToken || !destinationToken) {
        throw new Error("Token not found");
      }

      const fromAmount = parseUnits(
        amount,
        sourceToken.decimals
      ).toString();

      const theRoutes = await findRoutes(
        sourceChain.chainId,
        destinationChain.chainId,
        sourceToken.address,
        destinationToken.address,
        fromAmount
      );

      if (theRoutes.length === 0) {
        throw new Error("No route found");
      }

      console.log("Routes:", theRoutes);

      /* setRoutes(theRoutes); */
      setRouteReady(true);
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRouteReady(false);
    setDevTab("summary");
  };

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
      <Header />

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
        <HeroSectionTop
          routeReady={routeReady}
          handleFind={handleFind}
          handleReset={handleReset}
          loading={loading}
          loadMsg={loadMsg}
          srcChain={srcChain}
          setSrcChain={setSrcChain}
          srcToken={srcToken}
          setSrcToken={setSrcToken}
          amount={amount}
          setAmount={setAmount}
          dstChain={dstChain}
          setDstChain={setDstChain}
          dstToken={dstToken}
          setDstToken={setDstToken}
        />

        {/* The Bottom part of the Herosection */}
        {routeReady && <HeroSectionBottom devTab={devTab} setDevTab={setDevTab} /* routes={routes} */ />}

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
