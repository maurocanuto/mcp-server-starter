import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { MCP_CONFIG } from "./config";
import {
  getPatientConfig,
  getPatientHandler,
  GetPatientInput,
  GetPatientOutput,
  PatientSearchInput,
  PatientSearchOutput,
  searchPatientConfig,
  searchPatientHandler,
} from "./tools";

const server = new McpServer({
  name: MCP_CONFIG.name,
  version: MCP_CONFIG.version,
});

server.registerTool(
  getPatientConfig.name,
  {
    title: getPatientConfig.title,
    description: getPatientConfig.description,
    inputSchema: GetPatientInput.shape,
    outputSchema: GetPatientOutput.shape,
  },
  getPatientHandler
);

server.registerTool(
  searchPatientConfig.name,
  {
    title: searchPatientConfig.title,
    description: searchPatientConfig.description,
    inputSchema: PatientSearchInput.shape,
    outputSchema: PatientSearchOutput.shape,
  },
  searchPatientHandler
);

async function startServer() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (error) {
    console.error(`[patient-mcp] Error: ${error}\n`);
  }
}

startServer();
