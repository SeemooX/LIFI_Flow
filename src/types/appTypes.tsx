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

export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
}

export interface Chain {
  id: string;
  chainId: number;
  name: string;
  color: string;
  symbol: string;
  tokens: Token[];
}

export interface HeroSectionTopProps {
  routeReady: boolean;
  handleFind: () => void;
  handleReset: () => void;
  loading: boolean;
  loadMsg: string;

  srcChain: string;
  setSrcChain: React.Dispatch<React.SetStateAction<string>>;

  srcToken: string;
  setSrcToken: React.Dispatch<React.SetStateAction<string>>;

  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;

  dstChain: string;
  setDstChain: React.Dispatch<React.SetStateAction<string>>;

  dstToken: string;
  setDstToken: React.Dispatch<React.SetStateAction<string>>;
}


export type HeroSectionBottomProps = {
  devTab: "summary" | "json";
  setDevTab: React.Dispatch<React.SetStateAction<"summary" | "json">>;
  routes: any[];
  routeSummary: any;
  rawRoute: any;
};

export type TokenSelectProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Token[];
}