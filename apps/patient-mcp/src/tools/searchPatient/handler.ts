import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { findPatients } from "../../data/mockPatients";
import {
  PatientSearchInput,
  type PatientSearchInputType,
  type PatientSearchOutputType,
} from "./types";

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
