import { PractitionerSearchInputType } from "../tools/searchPractitioner/types";

export interface Practitioner {
  id: string;
  name: string;
  specialty: string;
  email?: string;
  phone?: string;
  licenseNumber?: string;
  yearsOfExperience?: number;
}

// Mock practitioner data
export const mockPractitioners: Practitioner[] = [
  {
    id: "DOC001",
    name: "Dr. Alice Johnson",
    specialty: "Cardiology",
    email: "alice.johnson@hospital.com",
    phone: "+1-555-0201",
    licenseNumber: "MD12345",
    yearsOfExperience: 15,
  },
  {
    id: "DOC002",
    name: "Dr. Robert Chen",
    specialty: "Neurology",
    email: "robert.chen@hospital.com",
    phone: "+1-555-0202",
    licenseNumber: "MD12346",
    yearsOfExperience: 12,
  },
  {
    id: "DOC003",
    name: "Dr. Maria Garcia",
    specialty: "Pediatrics",
    email: "maria.garcia@hospital.com",
    phone: "+1-555-0203",
    licenseNumber: "MD12347",
    yearsOfExperience: 8,
  },
  {
    id: "DOC004",
    name: "Dr. James Wilson",
    specialty: "Orthopedics",
    email: "james.wilson@hospital.com",
    phone: "+1-555-0204",
    licenseNumber: "MD12348",
    yearsOfExperience: 20,
  },
  {
    id: "DOC005",
    name: "Dr. Lisa Thompson",
    specialty: "Dermatology",
    email: "lisa.thompson@hospital.com",
    phone: "+1-555-0205",
    licenseNumber: "MD12349",
    yearsOfExperience: 10,
  },
  {
    id: "DOC006",
    name: "Dr. Michael Brown",
    specialty: "Cardiology",
    email: "michael.brown@hospital.com",
    phone: "+1-555-0206",
    licenseNumber: "MD12350",
    yearsOfExperience: 18,
  },
  {
    id: "DOC007",
    name: "Dr. Sarah Williams",
    specialty: "Oncology",
    email: "sarah.williams@hospital.com",
    phone: "+1-555-0207",
    licenseNumber: "MD12351",
    yearsOfExperience: 14,
  },
  {
    id: "DOC008",
    name: "Dr. David Lee",
    specialty: "Psychiatry",
    email: "david.lee@hospital.com",
    phone: "+1-555-0208",
    licenseNumber: "MD12352",
    yearsOfExperience: 22,
  },
];

// Mock query function
export async function findPractitioners(
  searchInput: PractitionerSearchInputType
): Promise<Practitioner[]> {
  // Simulate database query delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  let filteredPractitioners = [...mockPractitioners];

  // Filter by name if provided
  if (searchInput.name) {
    const searchName = searchInput.name.toLowerCase();
    filteredPractitioners = filteredPractitioners.filter((practitioner) =>
      practitioner.name.toLowerCase().includes(searchName)
    );
  }

  // Filter by specialty if provided
  if (searchInput.specialty) {
    const searchSpecialty = searchInput.specialty.toLowerCase();
    filteredPractitioners = filteredPractitioners.filter((practitioner) =>
      practitioner.specialty.toLowerCase().includes(searchSpecialty)
    );
  }

  // Filter by email if provided
  if (searchInput.email) {
    const searchEmail = searchInput.email.toLowerCase();
    filteredPractitioners = filteredPractitioners.filter((practitioner) =>
      practitioner.email?.toLowerCase().includes(searchEmail)
    );
  }

  // Filter by phone if provided
  if (searchInput.phone) {
    const searchPhone = searchInput.phone.replace(/\D/g, ""); // Remove non-digits
    filteredPractitioners = filteredPractitioners.filter((practitioner) =>
      practitioner.phone?.replace(/\D/g, "").includes(searchPhone)
    );
  }

  // Filter by license number if provided
  if (searchInput.licenseNumber) {
    const searchLicense = searchInput.licenseNumber.toLowerCase();
    filteredPractitioners = filteredPractitioners.filter((practitioner) =>
      practitioner.licenseNumber?.toLowerCase().includes(searchLicense)
    );
  }

  // Filter by exact years of experience if provided
  if (searchInput.yearsOfExperience !== undefined) {
    filteredPractitioners = filteredPractitioners.filter(
      (practitioner) =>
        practitioner.yearsOfExperience === searchInput.yearsOfExperience
    );
  }

  // Filter by years of experience range if provided
  if (searchInput.yearsOfExperienceRange) {
    const { min, max } = searchInput.yearsOfExperienceRange;
    if (min !== undefined || max !== undefined) {
      filteredPractitioners = filteredPractitioners.filter((practitioner) => {
        const experience = practitioner.yearsOfExperience;
        if (experience === undefined) return false;

        if (min !== undefined && max !== undefined) {
          return experience >= min && experience <= max;
        } else if (min !== undefined) {
          return experience >= min;
        } else if (max !== undefined) {
          return experience <= max;
        }
        return true;
      });
    }
  }

  return filteredPractitioners;
}
