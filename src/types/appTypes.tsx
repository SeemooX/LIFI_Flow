export type StepKind = "swap" | "bridge";

export interface RouteStep {
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

export interface Chain {
  id: string;
  name: string;
  color: string;
  symbol: string;
}

export type HeroSectionTopProps = {
  routeReady: boolean;
  loading: boolean;
  handleReset: () => void;
  handleFind: () => void;
  loadMsg: string;
};