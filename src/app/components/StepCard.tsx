import { ArrowRight, ArrowRightLeft, Clock, GitBranch, Shield, Zap } from "lucide-react";
import type { RouteStep, StepKind } from "../../types/appTypes";
import { CHAIN_MAP } from "../../config/chains";

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


const StepCard = ({ step, isLast }: { step: RouteStep; isLast: boolean }) => {
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

export default StepCard;