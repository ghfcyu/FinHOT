// Verifies MCP with the official SDK client: handshake, list the five tools, call each once.
// node scripts/mcp-check.ts [url]
import { Client } from "@modelcontextprotocol/client";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { SITE } from "@aihot/industry/site";

const url = new URL(process.argv[2] ?? "http://127.0.0.1:3001/api/mcp");
const client = new Client({ name: `${SITE.mcpPrefix}-mcp-check`, version: "1.0.0" });
await client.connect(new StreamableHTTPClientTransport(url));
const info = client.getServerVersion?.();
console.log("server:", JSON.stringify(info));
const tools = await client.listTools();
console.log("tools:", tools.tools.map((t) => t.name).join(", "));
const p = SITE.mcpPrefix;
const calls: Array<[string, Record<string, unknown>]> = [
  [`${p}_get_latest`, { limit: 2 }],
  [`${p}_search`, { q: "央行", limit: 2 }],
  [`${p}_get_hot_topics`, { limit: 3 }],
  [`${p}_get_daily`, {}],
  [`${p}_get_latest`, { limit: 99 }],
];
const hot = await client.callTool({ name: `${p}_get_hot_topics`, arguments: { limit: 1 } });
const storyId = ((hot.structuredContent as any)?.items?.[0]?.links?.story ?? "").split("/").pop();
if (storyId) calls.push([`${p}_get_story`, { public_id: storyId, report_limit: 3 }]);
for (const [name, args] of calls) {
  const r = await client.callTool({ name, arguments: args });
  const text = (r.content as Array<{ type: string; text?: string }>)[0]?.text ?? "";
  console.log(`${name} ${JSON.stringify(args)} → ${r.isError ? "ERROR" : "ok"} | ${text.replace(/\n/g, " ").slice(0, 140)}`);
}
await client.close();
