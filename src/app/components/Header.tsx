import { ArrowRightLeft } from "lucide-react";

const Header = () => {
    return(<div className="relative border-b border-border">
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
      </div>)
}

export default Header;