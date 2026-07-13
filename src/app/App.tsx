import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  ChevronDown,
  Clock,
  Zap,
  GitBranch,
  RefreshCw,
  Copy,
  Check,
  Layers,
  Shield,
  ArrowRightLeft,
  Code2,
  FileText,
  Loader2,
  TrendingUp,
  Activity,
  X,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type StepKind = "swap" | "bridge";

interface Chain {
  id: string;
  name: string;
  color: string;
  symbol: string;
}

interface RouteStep {
  id: number;
  kind: StepKind;
  protocol: string;
  protocolInitial: string;
  protocolColor: string;
  fromToken: string;
  toToken: string;
  fromChain: string;
  toChain: string;
  gas: string;
  duration: string;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const CHAINS: Chain[] = [
  { id: "eth",  name: "Ethereum", color: "#627EEA", symbol: "Ξ"  },
  { id: "base", name: "Base",     color: "#0052FF", symbol: "B"  },
  { id: "pol",  name: "Polygon",  color: "#8247E5", symbol: "P"  },
  { id: "arb",  name: "Arbitrum", color: "#12AAFF", symbol: "A"  },
  { id: "opt",  name: "Optimism", color: "#FF0420", symbol: "O"  },
  { id: "sol",  name: "Solana",   color: "#9945FF", symbol: "S"  },
];

const CHAIN_MAP = Object.fromEntries(CHAINS.map((c) => [c.id, c]));

const TOKENS: Record<string, string[]> = {
  eth:  ["ETH",  "USDC", "USDT", "DAI",  "WBTC"],
  base: ["ETH",  "USDC", "USDbC","DAI"],
  pol:  ["MATIC","USDC", "USDT", "DAI",  "WETH"],
  arb:  ["ETH",  "USDC", "USDT", "ARB",  "GMX"],
  opt:  ["ETH",  "USDC", "USDT", "OP"],
  sol:  ["SOL",  "USDC", "USDT", "RAY"],
};

const MOCK_STEPS: RouteStep[] = [
  {
    id: 1, kind: "swap",
    protocol: "Uniswap V3",    protocolInitial: "U", protocolColor: "#FF007A",
    fromToken: "ETH",  toToken: "USDC",
    fromChain: "eth",  toChain: "eth",
    gas: "$1.82", duration: "~30s",
  },
  {
    id: 2, kind: "bridge",
    protocol: "Stargate",       protocolInitial: "S", protocolColor: "#9B8CFF",
    fromToken: "USDC", toToken: "USDC",
    fromChain: "eth",  toChain: "pol",
    gas: "$1.20", duration: "~3m 30s",
  },
  {
    id: 3, kind: "swap",
    protocol: "QuickSwap",      protocolInitial: "Q", protocolColor: "#2D9CFF",
    fromToken: "USDC", toToken: "USDC",
    fromChain: "pol",  toChain: "pol",
    gas: "$0.40", duration: "~32s",
  },
];

const MOCK_SUMMARY = {
  output:   "1,847.23 USDC",
  time:     "4m 32s",
  gas:      "$3.42",
  bridge:   "Stargate",
  dex:      "Uniswap V3",
  slippage: "0.50%",
  steps:    3,
  tags:     ["CHEAPEST", "FASTEST"],
};

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

// ─── Syntax highlighter ───────────────────────────────────────────────────────

function highlight(obj: object): string {
  const raw = JSON.stringify(obj, null, 2)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return raw.replace(
    /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (m) => {
      if (/:$/.test(m))         return `<span class="jk">${m}</span>`;
      if (/^"/.test(m))         return `<span class="js">${m}</span>`;
      if (/true|false/.test(m)) return `<span class="jb">${m}</span>`;
      if (/null/.test(m))       return `<span class="jn">${m}</span>`;
                                return `<span class="ji">${m}</span>`;
    }
  );
}

// ─── Small components ─────────────────────────────────────────────────────────

function ChainPill({ chainId, showLabel = false }: { chainId: string; showLabel?: boolean }) {
  const c = CHAIN_MAP[chainId];
  if (!c) return null;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-bold leading-none flex-shrink-0"
        style={{ background: `${c.color}22`, color: c.color, border: `1px solid ${c.color}33` }}
      >
        {c.symbol}
      </span>
      {showLabel && <span className="text-sm text-foreground">{c.name}</span>}
    </span>
  );
}

function KindBadge({ kind }: { kind: StepKind }) {
  return kind === "bridge" ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold tracking-widest uppercase font-mono"
      style={{ background: "#9B8CFF18", color: "#9B8CFF", border: "1px solid #9B8CFF28" }}>
      <GitBranch className="w-2.5 h-2.5" /> BRIDGE
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold tracking-widest uppercase font-mono"
      style={{ background: "#2D9CFF18", color: "#2D9CFF", border: "1px solid #2D9CFF28" }}>
      <ArrowRightLeft className="w-2.5 h-2.5" /> SWAP
    </span>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-semibold tracking-widest uppercase font-mono text-muted-foreground mb-1.5">
      {children}
    </div>
  );
}

function SelectBox({
  label, value, onChange, options,
}: {
  label: string; value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const chain = CHAIN_MAP[value];
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="relative">
        {chain && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <span
              className="inline-flex items-center justify-center w-4 h-4 rounded text-[9px] font-bold"
              style={{ background: `${chain.color}22`, color: chain.color }}
            >
              {chain.symbol}
            </span>
          </span>
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none bg-secondary border border-border rounded-xl py-2.5 text-sm text-foreground pr-8 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/40 cursor-pointer transition-colors hover:border-white/15 font-mono ${chain ? "pl-9" : "pl-3.5"}`}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-[#141929]">{o.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}

function TokenSelect({
  label, value, onChange, options,
}: {
  label: string; value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-secondary border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground pr-8 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/40 cursor-pointer transition-colors hover:border-white/15 font-mono"
        >
          {options.map((t) => (
            <option key={t} value={t} className="bg-[#141929]">{t}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}

function Divider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="flex-1 h-px bg-border" />
      {label && <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{label}</span>}
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

function SectionHead({ title, meta }: { title: string; meta?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-xs font-semibold tracking-widest uppercase font-mono text-muted-foreground">{title}</span>
      {meta && <span className="text-[10px] font-mono text-muted-foreground/50">{meta}</span>}
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

function MetCard({
  label, value, icon: Icon, color,
}: {
  label: string; value: string; icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3 hover:border-white/10 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold tracking-widest uppercase font-mono text-muted-foreground">{label}</span>
        <span className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}18` }}>
          <Icon className="w-3.5 h-3.5" style={{ color }} />
        </span>
      </div>
      <div className="text-xl font-semibold text-foreground tracking-tight leading-none">{value}</div>
    </div>
  );
}

function StepCard({ step, isLast }: { step: RouteStep; isLast: boolean }) {
  const src = CHAIN_MAP[step.fromChain];
  const dst = CHAIN_MAP[step.toChain];
  const isCross = step.fromChain !== step.toChain;

  return (
    <div className="flex gap-4">
      {/* Timeline column */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono border flex-shrink-0"
          style={{
            background: `${step.protocolColor}15`,
            borderColor: `${step.protocolColor}35`,
            color: step.protocolColor,
          }}
        >
          {step.id}
        </div>
        {!isLast && (
          <div className="w-px flex-1 mt-2 mb-2" style={{ background: "rgba(255,255,255,0.05)", minHeight: 24 }} />
        )}
      </div>

      {/* Step card */}
      <div className="flex-1 bg-card border border-border rounded-2xl p-4 mb-3 transition-colors hover:border-white/10">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold font-mono flex-shrink-0 border"
              style={{
                background: `${step.protocolColor}18`,
                borderColor: `${step.protocolColor}28`,
                color: step.protocolColor,
              }}
            >
              {step.protocolInitial}
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground leading-none">{step.protocol}</div>
              <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                {isCross ? `${src?.name} → ${dst?.name}` : src?.name}
              </div>
            </div>
          </div>
          <KindBadge kind={step.kind} />
        </div>

        {/* Token flow */}
        <div className="flex items-center gap-2 bg-[#090c14] border border-border rounded-xl px-3.5 py-2.5 mb-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <ChainPill chainId={step.fromChain} />
            <span className="text-sm font-semibold font-mono text-foreground">{step.fromToken}</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mx-2" />
          <div className="flex items-center gap-1.5 min-w-0">
            <ChainPill chainId={step.toChain} />
            <span className="text-sm font-semibold font-mono text-foreground">{step.toToken}</span>
          </div>
          {isCross && (
            <span className="ml-auto text-[10px] font-mono text-muted-foreground/60 flex-shrink-0">cross-chain</span>
          )}
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-5 text-[11px] font-mono text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3 h-3" style={{ color: "#f59e0b" }} />
            {step.gas}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" style={{ color: "#38bdf8" }} />
            {step.duration}
          </span>
          {step.kind === "bridge" && (
            <span className="ml-auto flex items-center gap-1.5 text-muted-foreground/50">
              <Shield className="w-3 h-3" />
              insured
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text).catch(() => {});
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono text-muted-foreground hover:text-foreground border border-border hover:border-white/15 bg-white/[0.02] hover:bg-white/[0.05] transition-all"
    >
      {done ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
      {done ? "Copied!" : "Copy"}
    </button>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  // Form state
  const [srcChain, setSrcChain]     = useState("eth");
  const [srcToken, setSrcToken]     = useState("ETH");
  const [amount,   setAmount]       = useState("1.0");
  const [dstChain, setDstChain]     = useState("pol");
  const [dstToken, setDstToken]     = useState("USDC");

  // Result state
  const [loading,    setLoading]    = useState(false);
  const [loadMsg,    setLoadMsg]    = useState("");
  const [routeReady, setRouteReady] = useState(false);
  const [devTab,     setDevTab]     = useState<"summary" | "json">("summary");

  const msgIdxRef = useRef(0);

  // Sync tokens when chain changes
  useEffect(() => {
    const tokens = TOKENS[srcChain] ?? [];
    if (!tokens.includes(srcToken)) setSrcToken(tokens[0] ?? "");
  }, [srcChain]);

  useEffect(() => {
    const tokens = TOKENS[dstChain] ?? [];
    if (!tokens.includes(dstToken)) setDstToken(tokens[0] ?? "");
  }, [dstChain]);

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

  const chainOpts  = CHAINS.map((c) => ({ value: c.id, label: c.name }));
  const srcTokOpts = TOKENS[srcChain] ?? [];
  const dstTokOpts = TOKENS[dstChain] ?? [];
  const jsonStr    = JSON.stringify(RAW_JSON, null, 2);

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

      {/* ── Topbar ── */}
      <div className="relative border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "linear-gradient(135deg,#7c6aff,#9b5de5)" }}>
              <ArrowRightLeft className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight">LI.FI</span>
            <span className="text-border mx-1.5">/</span>
            <span className="text-xs text-muted-foreground font-mono">route-explorer</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono px-2 py-1 rounded-md border border-border text-muted-foreground">
              SDK v2.4.1
            </span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 6px rgba(52,211,153,0.8)" }} />
              <span className="text-[10px] font-mono text-muted-foreground">mainnet</span>
            </div>
          </div>
        </div>
      </div>

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

        {/* ── Route Configuration ── */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <span className="text-[10px] font-semibold tracking-widest uppercase font-mono text-muted-foreground">Route Configuration</span>
            {routeReady && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          {/* FROM / TO two-panel form */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 items-end">

            {/* FROM panel */}
            <div className="bg-secondary/50 border border-border rounded-xl p-4 space-y-3">
              <div className="text-[10px] font-semibold tracking-widest uppercase font-mono" style={{ color: "#7c6aff" }}>
                From
              </div>
              <SelectBox
                label="Chain"
                value={srcChain}
                onChange={setSrcChain}
                options={chainOpts}
              />
              <div className="grid grid-cols-2 gap-2">
                <TokenSelect
                  label="Token"
                  value={srcToken}
                  onChange={setSrcToken}
                  options={srcTokOpts}
                />
                <div>
                  <FieldLabel>Amount</FieldLabel>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.1"
                    className="w-full bg-secondary border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground font-mono focus:outline-none focus:ring-1 focus:border-primary/40 hover:border-white/15 transition-colors placeholder:text-muted-foreground"
                    style={{ "--tw-ring-color": "rgba(124,106,255,0.4)" } as React.CSSProperties}
                  />
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex lg:flex-col items-center justify-center gap-2 py-2">
              <div className="w-8 h-8 rounded-full border border-border bg-secondary flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground lg:block hidden" />
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground rotate-90 lg:hidden" />
              </div>
            </div>

            {/* TO panel */}
            <div className="bg-secondary/50 border border-border rounded-xl p-4 space-y-3">
              <div className="text-[10px] font-semibold tracking-widest uppercase font-mono" style={{ color: "#12AAFF" }}>
                To
              </div>
              <SelectBox
                label="Chain"
                value={dstChain}
                onChange={setDstChain}
                options={chainOpts}
              />
              <TokenSelect
                label="Token"
                value={dstToken}
                onChange={setDstToken}
                options={dstTokOpts}
              />
            </div>
          </div>

          {/* CTA */}
          <div className="mt-5">
            <button
              onClick={handleFind}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden"
              style={{
                background: loading
                  ? "rgba(124,106,255,0.4)"
                  : "linear-gradient(135deg, #7c6aff 0%, #9b5de5 50%, #7c6aff 100%)",
                backgroundSize: "200% 100%",
                boxShadow: loading ? "none" : "0 0 32px rgba(124,106,255,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="font-mono text-xs">{loadMsg}</span>
                </>
              ) : (
                <>
                  <span>Find Best Route</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Results ── */}
        {routeReady && (
          <div className="space-y-10">

            {/* Tags row */}
            <div className="flex items-center gap-2 -mt-4">
              {MOCK_SUMMARY.tags.map((tag) => (
                <span key={tag}
                  className="text-[10px] font-mono font-semibold tracking-widest px-2 py-1 rounded border"
                  style={{ background: "#7c6aff15", color: "#7c6aff", borderColor: "#7c6aff28" }}
                >
                  {tag}
                </span>
              ))}
              <span className="text-[10px] font-mono text-muted-foreground ml-auto">
                route_01j5kx7b2c9f8e3d
              </span>
            </div>

            {/* ── Route Summary ── */}
            <section>
              <SectionHead title="Route Summary" meta={`via ${MOCK_SUMMARY.bridge} + ${MOCK_SUMMARY.dex}`} />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                <MetCard label="Estimated Output" value={MOCK_SUMMARY.output}  icon={TrendingUp}    color="#34d399" />
                <MetCard label="Estimated Time"   value={MOCK_SUMMARY.time}    icon={Clock}         color="#38bdf8" />
                <MetCard label="Gas Cost"          value={MOCK_SUMMARY.gas}     icon={Zap}           color="#f59e0b" />
                <MetCard label="Steps"             value={`${MOCK_SUMMARY.steps} steps`} icon={Layers} color="#a78bfa" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <MetCard label="Bridge"   value={MOCK_SUMMARY.bridge}   icon={GitBranch}     color="#9B8CFF" />
                <MetCard label="DEX"      value={MOCK_SUMMARY.dex}      icon={RefreshCw}     color="#f472b6" />
                <MetCard label="Slippage" value={MOCK_SUMMARY.slippage} icon={Activity}      color="#6ee7b7" />
              </div>
            </section>

            {/* ── Execution Timeline ── */}
            <section>
              <SectionHead title="Execution Timeline" meta={`${MOCK_STEPS.length} steps`} />
              <div>
                {MOCK_STEPS.map((step, i) => (
                  <StepCard key={step.id} step={step} isLast={i === MOCK_STEPS.length - 1} />
                ))}
              </div>
            </section>

            {/* ── Developer View ── */}
            <section>
              <SectionHead title="Developer View" />

              {/* Tab bar */}
              <div className="flex items-center gap-1 mb-4 p-1 rounded-xl border border-border bg-secondary w-fit">
                {(["summary", "json"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setDevTab(tab)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      devTab === tab
                        ? "bg-card text-foreground shadow-sm border border-border"
                        : "text-muted-foreground hover:text-foreground/70"
                    }`}
                  >
                    {tab === "summary" ? <FileText className="w-3.5 h-3.5" /> : <Code2 className="w-3.5 h-3.5" />}
                    {tab === "summary" ? "Summary" : "Raw JSON"}
                  </button>
                ))}
              </div>

              {/* Summary tab */}
              {devTab === "summary" && (
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
                    <div className="p-5 space-y-5">
                      {[
                        { label: "Route ID",  value: "route_01j5kx7b2c9f8e3d", mono: true, color: "#7c6aff" },
                        { label: "From",      value: "1.0 ETH",   mono: true, color: "#e2e8f0" },
                        { label: "To (est.)", value: "~1,847.23 USDC", mono: true, color: "#34d399" },
                        { label: "Slippage",  value: "0.50%",     mono: true, color: "#e2e8f0" },
                      ].map(({ label, value, color }) => (
                        <div key={label}>
                          <div className="text-[10px] font-mono font-semibold uppercase tracking-widest text-muted-foreground mb-1">{label}</div>
                          <code className="text-xs font-mono break-all" style={{ color }}>{value}</code>
                        </div>
                      ))}
                    </div>
                    <div className="p-5 space-y-5">
                      {[
                        { label: "fromAmount (wei)", value: "1000000000000000000", color: "#fbbf24" },
                        { label: "toAmountMin",      value: "1838000000",          color: "#fbbf24" },
                        { label: "Insurance",        value: "INSURED · $0.12 fee", color: "#34d399" },
                        { label: "Tags",             value: "CHEAPEST, FASTEST",   color: "#a78bfa" },
                      ].map(({ label, value, color }) => (
                        <div key={label}>
                          <div className="text-[10px] font-mono font-semibold uppercase tracking-widest text-muted-foreground mb-1">{label}</div>
                          <code className="text-xs font-mono break-all" style={{ color }}>{value}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Chain summary row */}
                  <div className="border-t border-border px-5 py-4 flex items-center gap-6">
                    <div>
                      <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5">Source</div>
                      <ChainPill chainId="eth" showLabel />
                    </div>
                    <ArrowRight className="w-4 h-4 text-border mt-4" />
                    <div>
                      <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5">Destination</div>
                      <ChainPill chainId="pol" showLabel />
                    </div>
                    <div className="ml-auto flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-xs font-mono text-emerald-400">INSURED</span>
                    </div>
                  </div>
                </div>
              )}

              {/* JSON tab */}
              {devTab === "json" && (
                <div className="bg-[#06090f] border border-border rounded-2xl overflow-hidden">
                  {/* Editor chrome */}
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-[#08091a]">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                      </div>
                      <span className="text-[11px] font-mono text-muted-foreground ml-2">route_response.json</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-muted-foreground/40">JSON</span>
                      <CopyBtn text={jsonStr} />
                    </div>
                  </div>

                  {/* Code body with line numbers */}
                  <div className="overflow-auto max-h-[540px]" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.06) transparent" }}>
                    <div className="flex" style={{ fontFamily: '"Geist Mono", "JetBrains Mono", monospace', fontSize: 12, lineHeight: "1.7" }}>
                      {/* Line numbers */}
                      <div className="select-none flex-shrink-0 px-4 py-5 text-right border-r border-border" style={{ color: "rgba(255,255,255,0.12)", minWidth: 48 }}>
                        {jsonStr.split("\n").map((_, i) => (
                          <div key={i}>{i + 1}</div>
                        ))}
                      </div>
                      {/* Code */}
                      <pre
                        className="flex-1 px-5 py-5 overflow-x-auto"
                        style={{ color: "#7d8aa0", margin: 0 }}
                        dangerouslySetInnerHTML={{ __html: highlight(RAW_JSON) }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>

            <div className="h-8" />
          </div>
        )}

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
