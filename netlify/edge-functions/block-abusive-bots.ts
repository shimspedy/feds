const ALWAYS_BLOCKED_USER_AGENT_PATTERNS = [
  /\bmj12bot\b/i,
  /\bbaiduspider\b/i,
  /\bsogou\b/i,
  /\b360spider\b/i,
  /\bhaosouspider\b/i,
  /\byisouspider\b/i,
  /\byoudaobot\b/i,
  /\btoutiaospider\b/i,
  /\bgptbot\b/i,
  /\bchatgpt-user\b/i,
  /\boai-searchbot\b/i,
  /\bclaudebot\b/i,
  /\bclaude-web\b/i,
  /\banthropic-ai\b/i,
  /\bperplexitybot\b/i,
  /\bbytespider\b/i,
  /\bamazonbot\b/i,
  /\bapplebot-extended\b/i,
  /\bccbot\b/i,
  /\bcohere-ai\b/i,
  /\bdiffbot\b/i,
  /\bsemrushbot\b/i,
  /\bahrefsbot\b/i,
  /\bdotbot\b/i,
  /\bpetalbot\b/i,
  /\bdataforseobot\b/i,
  /\bblexbot\b/i,
  /\bserpstatbot\b/i,
  /\bseekportbot\b/i,
];

const BLOCKED_COUNTRY_CODES = new Set(["CN", "SG"]);
const BLOCKED_AGENT_CATEGORIES = new Set(["ai-agent"]);
const SENSITIVE_PATH_AGENT_CATEGORIES = new Set(["crawler", "tooling", "none"]);
const BLOCKED_IPV4_CIDRS = ["81.167.0.0/16"];

const SENSITIVE_PATH_USER_AGENT_PATTERNS = [
  /\brss-parser\b/i,
  /\bmeta-externalagent\b/i,
  /\bfacebookexternalhit\b/i,
  /\bfacebookcatalog\b/i,
  /\bscrapy\b/i,
  /\bpython-requests\b/i,
];

const BOT_SENSITIVE_PATHS = [
  /^\/index\.(xml|json)$/i,
  /\/index\.xml$/i,
  /^\/whitehouse\/usha-vance\/usha-vance\.jpg$/i,
];

function isBotSensitivePath(pathname: string) {
  return BOT_SENSITIVE_PATHS.some((pattern) => pattern.test(pathname));
}

function parseAgentCategory(agentCategory: string | null) {
  return (agentCategory ?? "").split(";")[0].trim().toLowerCase();
}

function isAlwaysBlockedUserAgent(userAgent: string) {
  const normalized = userAgent.trim();

  if (!normalized) {
    return true;
  }

  return ALWAYS_BLOCKED_USER_AGENT_PATTERNS.some((pattern) => pattern.test(normalized));
}

function isSensitivePathBlockedUserAgent(userAgent: string) {
  const normalized = userAgent.trim();

  if (!normalized) {
    return true;
  }

  return SENSITIVE_PATH_USER_AGENT_PATTERNS.some((pattern) => pattern.test(normalized));
}

function ipv4ToNumber(ip: string) {
  const parts = ip.split(".");

  if (parts.length !== 4) {
    return null;
  }

  let value = 0;

  for (const part of parts) {
    if (!/^\d+$/.test(part)) {
      return null;
    }

    const octet = Number(part);

    if (octet < 0 || octet > 255) {
      return null;
    }

    value = (value << 8) + octet;
  }

  return value >>> 0;
}

function isIpv4InCidr(ip: string, cidr: string) {
  const [range, prefixLengthRaw] = cidr.split("/");
  const prefixLength = Number(prefixLengthRaw);
  const ipNumber = ipv4ToNumber(ip);
  const rangeNumber = ipv4ToNumber(range);

  if (ipNumber === null || rangeNumber === null || prefixLength < 0 || prefixLength > 32) {
    return false;
  }

  const mask = prefixLength === 0 ? 0 : (0xffffffff << (32 - prefixLength)) >>> 0;

  return (ipNumber & mask) === (rangeNumber & mask);
}

function getBlockedIpv4Cidr(ip?: string) {
  if (!ip) {
    return "";
  }

  return BLOCKED_IPV4_CIDRS.find((cidr) => isIpv4InCidr(ip, cidr)) ?? "";
}

type NetlifyEdgeContext = {
  geo?: {
    country?: {
      code?: string;
      name?: string;
    };
  };
  ip?: string;
  requestId?: string;
  next: () => Promise<Response>;
};

function getBlockReason(
  pathname: string,
  userAgent: string,
  agentCategory: string,
  context: NetlifyEdgeContext,
) {
  const countryCode = context.geo?.country?.code?.toUpperCase() ?? "";
  const blockedCidr = getBlockedIpv4Cidr(context.ip);

  if (blockedCidr) {
    return `ip:${blockedCidr}`;
  }

  if (countryCode && BLOCKED_COUNTRY_CODES.has(countryCode)) {
    return `country:${countryCode}`;
  }

  if (BLOCKED_AGENT_CATEGORIES.has(agentCategory)) {
    return `agent-category:${agentCategory}`;
  }

  if (isAlwaysBlockedUserAgent(userAgent)) {
    return "user-agent:always";
  }

  if (
    isBotSensitivePath(pathname) &&
    (isSensitivePathBlockedUserAgent(userAgent) ||
      SENSITIVE_PATH_AGENT_CATEGORIES.has(agentCategory))
  ) {
    return `sensitive-path:${agentCategory || "user-agent"}`;
  }

  return "";
}

export default async function blockAbusiveBots(
  request: Request,
  context: NetlifyEdgeContext,
) {
  const url = new URL(request.url);
  const userAgent = request.headers.get("user-agent") ?? "";
  const agentCategory = parseAgentCategory(request.headers.get("netlify-agent-category"));
  const blockReason = getBlockReason(url.pathname, userAgent, agentCategory, context);

  if (blockReason) {
    console.log(
      JSON.stringify({
        event: "blocked-request",
        reason: blockReason,
        path: url.pathname,
        ip: context.ip ?? "",
        country: context.geo?.country?.code ?? "",
        agentCategory,
        userAgent: userAgent.slice(0, 240),
        requestId: context.requestId ?? "",
      }),
    );

    return new Response("Forbidden\n", {
      status: 403,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
        "x-robots-tag": "noindex, nofollow, noarchive",
      },
    });
  }

  return context.next();
}
