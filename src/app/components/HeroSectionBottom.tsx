import { ArrowRight, Check, Copy, Shield } from "lucide-react";
import StepCard from "./StepCard";
import { useState } from "react";
import { highlight } from "../../utils/helpers";

interface Head {
    title: string; 
    meta?: string 
}

interface Card {
    label: string; 
    value: string; 
    icon: React.ElementType; 
    color: string;
}

function SectionHead({ title, meta }: Head) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-xs font-semibold tracking-widest uppercase font-mono text-muted-foreground">{title}</span>
      {meta && <span className="text-[10px] font-mono text-muted-foreground/50">{meta}</span>}
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

function MetCard({ label, value, icon: Icon, color }: Card) {
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

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text).catch(() => { });
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


const HeroSectionBottom = () => {
    return (
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
                    <MetCard label="Estimated Output" value={MOCK_SUMMARY.output} icon={TrendingUp} color="#34d399" />
                    <MetCard label="Estimated Time" value={MOCK_SUMMARY.time} icon={Clock} color="#38bdf8" />
                    <MetCard label="Gas Cost" value={MOCK_SUMMARY.gas} icon={Zap} color="#f59e0b" />
                    <MetCard label="Steps" value={`${MOCK_SUMMARY.steps} steps`} icon={Layers} color="#a78bfa" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <MetCard label="Bridge" value={MOCK_SUMMARY.bridge} icon={GitBranch} color="#9B8CFF" />
                    <MetCard label="DEX" value={MOCK_SUMMARY.dex} icon={RefreshCw} color="#f472b6" />
                    <MetCard label="Slippage" value={MOCK_SUMMARY.slippage} icon={Activity} color="#6ee7b7" />
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
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${devTab === tab
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
                                    { label: "Route ID", value: "route_01j5kx7b2c9f8e3d", mono: true, color: "#7c6aff" },
                                    { label: "From", value: "1.0 ETH", mono: true, color: "#e2e8f0" },
                                    { label: "To (est.)", value: "~1,847.23 USDC", mono: true, color: "#34d399" },
                                    { label: "Slippage", value: "0.50%", mono: true, color: "#e2e8f0" },
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
                                    { label: "toAmountMin", value: "1838000000", color: "#fbbf24" },
                                    { label: "Insurance", value: "INSURED · $0.12 fee", color: "#34d399" },
                                    { label: "Tags", value: "CHEAPEST, FASTEST", color: "#a78bfa" },
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
    )
}

export default HeroSectionBottom;