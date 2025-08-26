import { z } from "zod";

export const PractitionerSearchInput = z.object({
  name: z.string().optional(),
  specialty: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  licenseNumber: z.string().optional(),
  yearsOfExperience: z.number().optional(),
  yearsOfExperienceRange: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
  }).optional(),
});

export const Practitioner = z.object({
  id: z.string(),
  name: z.string(),
  specialty: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
  licenseNumber: z.string().optional(),
  yearsOfExperience: z.number().optional(),
});

export const PractitionerSearchOutput = z.object({
  practitioners: z.array(Practitioner),
});

export type PractitionerSearchInputType = z.infer<
  typeof PractitionerSearchInput
>;
export type PractitionerType = z.infer<typeof Practitioner>;
export type PractitionerSearchOutputType = z.infer<
  typeof PractitionerSearchOutput
>;
