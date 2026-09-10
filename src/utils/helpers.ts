import type { RouteStep } from "../types/appTypes";

function getChainName(chainId?: number): string {
    switch (chainId) {
        case 1:
            return "eth";

        case 137:
            return "pol";

        default:
            return chainId?.toString() ?? "unknown";
    }
}

function formatGas(gasCosts?: any[]): string {
    if (!gasCosts?.length) {
        return "$0.00";
    }

    const total = gasCosts.reduce(
        (sum, gas) => sum + Number(gas.amountUSD ?? 0),
        0
    );

    return `$${total.toFixed(2)}`;
}

function formatDuration(seconds?: number): string {
    if (!seconds) {
        return "~0s";
    }

    if (seconds < 60) {
        return `~${Math.round(seconds)}s`;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);

    if (remainingSeconds === 0) {
        return `~${minutes}m`;
    }

    return `~${minutes}m ${remainingSeconds}s`;
}


// Transforming the LIFI route to or UI expectation
export function transformRoute(route: any): RouteStep[] {
    const steps: RouteStep[] = [];

    let id = 1;

    for (const step of route.steps ?? []) {
        for (const includedStep of step.includedSteps ?? []) {
            // Ignore fee collection steps in the visual route
            if (includedStep.type === "protocol") {
                continue;
            }

            const action = includedStep.action;
            const estimate = includedStep.estimate;
            const toolDetails = includedStep.toolDetails;

            const isBridge = includedStep.type === "cross";

            steps.push({
                id: id++,

                kind: isBridge ? "bridge" : "swap",

                protocol: toolDetails?.name ?? includedStep.tool ?? "Unknown",

                protocolInitial:
                    (toolDetails?.name ?? includedStep.tool ?? "?")
                        .charAt(0)
                        .toUpperCase(),

                protocolColor: isBridge
                    ? "#9B8CFF"
                    : "#2D9CFF",

                fromToken:
                    action?.fromToken?.symbol ?? "UNKNOWN",

                toToken:
                    action?.toToken?.symbol ?? "UNKNOWN",

                fromChain: getChainName(action?.fromChainId),

                toChain: getChainName(action?.toChainId),

                gas: formatGas(estimate?.gasCosts),

                duration: formatDuration(
                    estimate?.executionDuration
                ),
            });
        }
    }

    return steps;
}



function formatTokenAmount(
    amount: string,
    decimals: number
): string {
    const value = Number(amount) / 10 ** decimals;

    return value.toLocaleString(undefined, {
        maximumFractionDigits: 6,
    });
}

// Format summary
export function transformSummary(route: any) {
    const steps = transformRoute(route);

    const totalGas = steps.reduce((total, step) => {
        return total + Number(step.gas.replace("$", ""));
    }, 0);

    const totalDuration = steps.reduce((total, step) => {
        const match = step.duration.match(
            /(?:(\d+)m)?\s*(?:(\d+)s)?/
        );

        if (!match) return total;

        const minutes = Number(match[1] ?? 0);
        const seconds = Number(match[2] ?? 0);

        return total + minutes * 60 + seconds;
    }, 0);

    return {
        output: `${formatTokenAmount(
            route.toAmount,
            route.toToken.decimals
        )} ${route.toToken.symbol}`,

        time: formatDuration(totalDuration),

        gas: `$${totalGas.toFixed(2)}`,

        bridge:
            steps.find(step => step.kind === "bridge")?.protocol ??
            "None",

        dex:
            steps.find(step => step.kind === "swap")?.protocol ??
            "None",

        slippage: `${(
            (route.steps?.[0]?.action?.slippage ?? 0) * 100
        ).toFixed(2)}%`,

        steps: steps.length,

        tags: route.tags ?? [],
    };
}


export function highlight(obj: object): string {
  const raw = JSON.stringify(obj, null, 2)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return raw.replace(
    /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (m) => {
      if (/:$/.test(m)) return `<span class="jk">${m}</span>`;
      if (/^"/.test(m)) return `<span class="js">${m}</span>`;
      if (/true|false/.test(m)) return `<span class="jb">${m}</span>`;
      if (/null/.test(m)) return `<span class="jn">${m}</span>`;
      return `<span class="ji">${m}</span>`;
    }
  );
}