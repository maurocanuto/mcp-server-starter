# Building MCP Servers in a Monorepo with Turborepo and TypeScript: A Complete Tutorial

## Introduction

Model Context Protocol (MCP) is revolutionizing how AI models interact with external data sources and tools. In this comprehensive tutorial, we'll explore how to build multiple MCP servers within a monorepo structure using Turborepo and TypeScript. We'll cover the setup, implementation, and the critical lessons learned during development.

## What We're Building

This repository contains two MCP servers:

- **Patient MCP Server**: Handles patient data operations (get patient by ID, search patients)
- **Practitioner MCP Server**: Manages practitioner data operations (search practitioners)

Both servers are built using the official MCP SDK and follow best practices for TypeScript development.

## Repository Structure

```
hisy-mcp/
├── apps/
│   ├── patient-mcp/          # Patient data MCP server
│   └── practitioner-mcp/     # Practitioner data MCP server
├── packages/                 # Shared packages (future use)
├── turbo.json               # Turborepo configuration
└── pnpm-workspace.yaml      # PNPM workspace configuration
```

## Prerequisites

- Node.js 18+
- PNPM (for workspace management)
- TypeScript 5.8+
- Understanding of MCP concepts

## Setting Up the Monorepo

### 1. Initialize the Workspace

```bash
# Create the workspace
mkdir hisy-mcp
cd hisy-mcp

# Initialize PNPM workspace
pnpm init
```

### 2. Configure PNPM Workspace

```yaml:pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

### 3. Set Up Turborepo

```json:turbo.json
{
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": {},
    "test": { "dependsOn": ["build"] }
  }
}
```

The `^build` dependency ensures that packages are built in the correct order, and `outputs: ["dist/**"]` tells Turborepo where to find build artifacts for caching.

## Building the MCP Servers

### 1. Patient MCP Server Structure

```
apps/patient-mcp/
├── src/
│   ├── index.ts              # Server entry point
│   ├── config.ts             # Server configuration
│   ├── data/
│   │   └── mockPatients.ts   # Mock data source
│   └── tools/
│       ├── index.ts          # Tool exports
│       ├── getPatient/       # Get patient tool
│       └── searchPatient/    # Search patients tool
├── package.json
└── tsconfig.json
```

### 2. Core Server Implementation

```typescript:apps/patient-mcp/src/index.ts
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

// Register tools with the server
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

// Start the server
async function startServer() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (error) {
    console.error(`[patient-mcp] Error: ${error}\n`);
  }
}

startServer();
```

### 3. Tool Implementation with Zod Validation

```typescript:apps/patient-mcp/src/tools/getPatient/types.ts
import { z } from "zod";

export const GetPatientInput = z.object({
  id: z.string(),
});

const Patient = z.object({
  id: z.string(),
  name: z.string(),
  dateOfBirth: z.string(),
  gender: z.enum(["male", "female", "other"]),
});

export const GetPatientOutput = z.object({
  patient: Patient.nullable(),
});

export type GetPatientInputType = z.infer<typeof GetPatientInput>;
export type GetPatientOutputType = z.infer<typeof GetPatientOutput>;
```

### 4. Tool Handler Implementation

```typescript:apps/patient-mcp/src/tools/getPatient/handler.ts
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { getPatientById } from "../../data/mockPatients";
import {
  GetPatientInput,
  type GetPatientInputType,
  type GetPatientOutputType,
} from "./types";

export async function getPatientHandler(
  args: GetPatientInputType
): Promise<CallToolResult> {
  try {
    const parsedInput = GetPatientInput.parse(args);
    const patient = await getPatientById(parsedInput);

    const payload: GetPatientOutputType = { patient: patient ?? null };

    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,  // ⚠️ CRITICAL: This field is required!
      isError: false,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    return {
      content: [{ type: "text", text: `Tool execution failed: ${message}` }],
      structuredContent: { patient: null },  // ⚠️ CRITICAL: Even in error cases!
      isError: true,
    };
  }
}
```

## Critical Lessons Learned During Development

### 1. The `structuredContent` Requirement

**Error**: MCP tools were failing with cryptic errors about missing structured content.

**Root Cause**: The MCP SDK requires all tool handlers to return a `structuredContent` field, even when there's an error.

**Solution**: Always include `structuredContent` in your return object:

```typescript
// ❌ Wrong - Missing structuredContent
return {
  content: [{ type: "text", text: "Success" }],
  isError: false,
};

// ✅ Correct - Includes structuredContent
return {
  content: [{ type: "text", text: "Success" }],
  structuredContent: { result: "success" },
  isError: false,
};
```

### 2. TypeScript Compilation with `tsdown`

**Error**: Standard TypeScript compilation wasn't producing the correct output format for MCP servers.

**Root Cause**: MCP servers need to run as executable scripts, and the standard `tsc` output doesn't handle this properly.

**Solution**: Use `tsdown` for compilation:

```json:apps/patient-mcp/package.json
{
  "scripts": {
    "build": "tsdown && chmod 755 dist/index.js",
    "dev": "tsdown --watch"
  },
  "dependencies": {
    "tsdown": "^0.14.2"
  },
  "tsdown": {
    "entries": ["src/index.ts"],
    "format": ["esm"],
    "dts": true,
    "sourcemap": true,
    "clean": true,
    "external": ["@modelcontextprotocol/sdk"]
  }
}
```

**Why `tsdown`?**

- Produces single-file outputs perfect for CLI tools
- Handles ESM modules correctly
- Automatically makes output files executable
- Better tree-shaking and bundling for server applications

### 3. Proper Error Handling

**Error**: Tools were crashing when encountering validation errors or data issues.

**Solution**: Implement comprehensive error handling with proper fallbacks:

```typescript
export async function searchPatientHandler(
  args: PatientSearchInputType
): Promise<CallToolResult> {
  try {
    const parsedInput = PatientSearchInput.parse(args);
    const patients = await findPatients(parsedInput);

    const payload: PatientSearchOutputType = { patients: patients ?? [] };

    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
      isError: false,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    return {
      content: [{ type: "text", text: `Tool execution failed: ${message}` }],
      structuredContent: { patients: [] } satisfies PatientSearchOutputType,
      isError: true,
    };
  }
}
```

### 4. Zod Schema Validation

**Error**: Runtime type errors when tools received unexpected input.

**Solution**: Use Zod for runtime validation:

```typescript
// Input validation
const parsedInput = GetPatientInput.parse(args);

// This will throw if args.id is missing or not a string
// The error is caught and handled gracefully
```

## Building and Running

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Build All Servers

```bash
pnpm build
```

### 3. Run Individual Servers

```bash
# Patient MCP Server
cd apps/patient-mcp
pnpm start

# Practitioner MCP Server
cd apps/practitioner-mcp
pnpm start
```

### 4. Development Mode

```bash
# Watch mode for development
pnpm dev

# This will rebuild automatically when files change
```

## Testing the MCP Servers

### 1. Using MCP Client

```bash
# Install MCP client
npm install -g @modelcontextprotocol/client

# Test patient server
mcp --server "node apps/patient-mcp/dist/index.js" list-tools
```

### 2. Tool Invocation

```bash
# Get patient by ID
mcp --server "node apps/patient-mcp/dist/index.js" call-tool getPatient '{"id": "123"}'

# Search patients
mcp --server "node apps/patient-mcp/dist/index.js" call-tool searchPatient '{"query": "John"}'
```

## Best Practices Learned

### 1. Always Return `structuredContent`

```typescript
// This is a requirement, not optional
return {
  content: [...],
  structuredContent: yourData,  // Required!
  isError: false,
};
```

### 2. Use `tsdown` for MCP Server Compilation

```bash
# Don't use tsc for MCP servers
# Use tsdown instead
pnpm add tsdown
```

### 3. Implement Proper Error Boundaries

```typescript
try {
  // Your tool logic
} catch (error) {
  // Always return a valid CallToolResult
  return {
    content: [{ type: "text", text: `Error: ${error.message}` }],
    structuredContent: fallbackData,
    isError: true,
  };
}
```

### 4. Use Zod for Runtime Validation

```typescript
// Validate inputs at runtime
const validatedInput = YourInputSchema.parse(args);

// This prevents runtime errors and provides better error messages
```

## Troubleshooting Common Issues

### 1. "Module not found" Errors

**Cause**: Incorrect import paths or missing dependencies.

**Solution**:

- Ensure all dependencies are installed with `pnpm install`
- Check that import paths use `.js` extensions for ESM
- Verify `tsdown` configuration includes all necessary files

### 2. Permission Denied Errors

**Cause**: Output files aren't executable.

**Solution**:

- Use `tsdown` which handles this automatically
- Or manually run `chmod 755 dist/index.js` after building

### 3. MCP Tool Registration Failures

**Cause**: Incorrect tool configuration or missing schemas.

**Solution**:

- Ensure all tools have proper input/output schemas
- Verify tool names are unique
- Check that handlers return the correct `CallToolResult` type

## Conclusion

Building MCP servers in a monorepo with Turborepo and TypeScript provides excellent developer experience and code organization. The key takeaways are:

1. **Always include `structuredContent`** in your tool responses
2. **Use `tsdown` instead of `tsc`** for MCP server compilation
3. **Implement comprehensive error handling** with proper fallbacks
4. **Validate inputs with Zod** to prevent runtime errors
5. **Leverage Turborepo's caching** for faster builds

This setup allows you to maintain multiple MCP servers efficiently while sharing common patterns and configurations. The monorepo structure makes it easy to add new servers or shared utilities as your project grows.

## Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [Turborepo Documentation](https://turbo.build/repo)
- [Zod Documentation](https://zod.dev/)
- [tsdown Documentation](https://github.com/egoist/tsdown)

---

_This tutorial demonstrates building production-ready MCP servers with modern TypeScript practices. The lessons learned here can be applied to any MCP server implementation._
