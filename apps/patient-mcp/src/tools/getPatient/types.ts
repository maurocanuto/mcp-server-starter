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
