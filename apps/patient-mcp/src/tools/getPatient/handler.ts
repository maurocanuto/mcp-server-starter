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
      structuredContent: payload,
      isError: false,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    return {
      content: [{ type: "text", text: `Tool execution failed: ${message}` }],
      structuredContent: { patient: null },
      isError: true,
    };
  }
}
