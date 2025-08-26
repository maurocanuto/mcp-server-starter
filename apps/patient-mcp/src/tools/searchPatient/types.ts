import { z } from "zod";

export const PatientSearchInput = z.object({
  name: z.string().optional(),
  dateOfBirth: z.string().optional(), // Exact date match
  dateOfBirthRange: z
    .object({
      start: z.string().optional(), // Start date for range search
      end: z.string().optional(), // End date for range search
    })
    .optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const Patient = z.object({
  id: z.string(),
  name: z.string(),
  dateOfBirth: z.string(),
  gender: z.enum(["male", "female", "other"]),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const PatientSearchOutput = z.object({
  patients: z.array(Patient),
});

export type PatientSearchInputType = z.infer<typeof PatientSearchInput>;
export type PatientSearchOutputType = z.infer<typeof PatientSearchOutput>;
