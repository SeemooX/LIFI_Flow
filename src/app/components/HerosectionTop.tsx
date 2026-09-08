import { ArrowRight, ChevronDown, Loader2, X } from "lucide-react";
import type { HeroSectionTopProps } from "../../types/appTypes";
import type { Chain } from "../../types/appTypes";
import { useState } from "react";

interface Box {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
    CHAIN_MAP: Record<string, Chain>
}

interface Box1 {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: string[];
}

const TOKENS: Record<string, string[]> = {
  eth: ["ETH", "USDC", "USDT", "DAI", "WBTC"],
  base: ["ETH", "USDC", "USDbC", "DAI"],
  pol: ["MATIC", "USDC", "USDT", "DAI", "WETH"],
  arb: ["ETH", "USDC", "USDT", "ARB", "GMX"],
  opt: ["ETH", "USDC", "USDT", "OP"],
  sol: ["SOL", "USDC", "USDT", "RAY"],
};

const CHAINS: Chain[] = [
  { id: "eth", name: "Ethereum", color: "#627EEA", symbol: "Ξ" },
  { id: "base", name: "Base", color: "#0052FF", symbol: "B" },
  { id: "pol", name: "Polygon", color: "#8247E5", symbol: "P" },
  { id: "arb", name: "Arbitrum", color: "#12AAFF", symbol: "A" },
  { id: "opt", name: "Optimism", color: "#FF0420", symbol: "O" },
  { id: "sol", name: "Solana", color: "#9945FF", symbol: "S" },
];

const CHAIN_MAP = Object.fromEntries(CHAINS.map((c) => [c.id, c]));


function SelectBox({ label, value, onChange, options, CHAIN_MAP }: Box) {
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

function TokenSelect({ label, value, onChange, options }: Box1) {
    return (
        <div>
            <FieldLabel>{label}</FieldLabel>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full appearance-none bg-secondary border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground pr-8 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/40 cursor-pointer transition-colors hover:border-white/15 font-mono"
                >
                    {options.map((t: any) => (
                        <option key={t} value={t} className="bg-[#141929]">{t}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>
        </div>
    );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="text-[10px] font-semibold tracking-widest uppercase font-mono text-muted-foreground mb-1.5">
            {children}
        </div>
    );
}


const HeroSectionTop = ({ routeReady, handleFind, handleReset, loading, loadMsg }: HeroSectionTopProps) => {
    // Form state
    const [srcChain, setSrcChain] = useState("eth");
    const [srcToken, setSrcToken] = useState("ETH");
    const [amount, setAmount] = useState("1.0");
    const [dstChain, setDstChain] = useState("pol");
    const [dstToken, setDstToken] = useState("USDC");

    const chainOpts = CHAINS.map((c) => ({ value: c.id, label: c.name }));
    const srcTokOpts = TOKENS[srcChain] ?? [];
    const dstTokOpts = TOKENS[dstChain] ?? [];

    return (
        <>
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
                            CHAIN_MAP={CHAIN_MAP}
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
                            CHAIN_MAP={CHAIN_MAP}
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
        </>
    )
}

export default HeroSectionTop;