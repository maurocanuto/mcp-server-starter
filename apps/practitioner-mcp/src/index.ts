import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { MCP_CONFIG } from "./config";
import {
  PractitionerSearchInput,
  PractitionerSearchOutput,
  searchPractitionerConfig,
  searchPractitionerHandler,
} from "./tools";

const server = new McpServer({
  name: MCP_CONFIG.name,
  version: MCP_CONFIG.version,
});

// Register the search practitioner tool
server.registerTool(
  searchPractitionerConfig.name,
  {
    title: searchPractitionerConfig.title,
    description: searchPractitionerConfig.description,
    inputSchema: PractitionerSearchInput.shape,
    outputSchema: PractitionerSearchOutput.shape,
  },
  searchPractitionerHandler
);

// Start the server
(async () => {
  console.error(
    "[practitioner-mcp] MCP server starting with stdio transport..."
  );
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[practitioner-mcp] MCP server connected and ready");
})();
