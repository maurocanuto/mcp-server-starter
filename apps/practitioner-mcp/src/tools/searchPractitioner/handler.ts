import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { findPractitioners } from "../../data/mockPractitioners";
import {
  PractitionerSearchInput,
  type PractitionerSearchInputType,
  type PractitionerSearchOutputType,
} from "./types";

export async function searchPractitionerHandler(
  args: PractitionerSearchInputType
): Promise<CallToolResult> {
  try {
    const parsedInput = PractitionerSearchInput.parse(args);
    const practitioners = await findPractitioners(parsedInput);

    const payload: PractitionerSearchOutputType = {
      practitioners: practitioners ?? [],
    };

    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
      isError: false,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    return {
      content: [{ type: "text", text: `Tool execution failed: ${message}` }],
      structuredContent: {
        practitioners: [],
      } satisfies PractitionerSearchOutputType,
      isError: true,
    };
  }
}
