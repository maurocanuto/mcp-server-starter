import type { GetPatientInputType, PatientSearchInputType } from "../tools";

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  email?: string;
  phone?: string;
  address?: string;
}

// Mock patient data
export const mockPatients: Patient[] = [
  {
    id: "P001",
    name: "John Smith",
    dateOfBirth: "1985-03-15",
    gender: "male",
    email: "john.smith@email.com",
    phone: "+1-555-0101",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: "P002",
    name: "Sarah Johnson",
    dateOfBirth: "1990-07-22",
    gender: "female",
    email: "sarah.johnson@email.com",
    phone: "+1-555-0102",
    address: "456 Oak Ave, Somewhere, USA",
  },
  {
    id: "P003",
    name: "Michael Brown",
    dateOfBirth: "1978-11-08",
    gender: "male",
    email: "michael.brown@email.com",
    phone: "+1-555-0103",
    address: "789 Pine Rd, Elsewhere, USA",
  },
  {
    id: "P004",
    name: "Emily Davis",
    dateOfBirth: "1992-04-12",
    gender: "female",
    email: "emily.davis@email.com",
    phone: "+1-555-0104",
    address: "321 Elm St, Nowhere, USA",
  },
  {
    id: "P005",
    name: "David Wilson",
    dateOfBirth: "1983-09-30",
    gender: "male",
    email: "david.wilson@email.com",
    phone: "+1-555-0105",
    address: "654 Maple Dr, Anywhere, USA",
  },
  {
    id: "P006",
    name: "Lisa Anderson",
    dateOfBirth: "1988-12-03",
    gender: "female",
    email: "lisa.anderson@email.com",
    phone: "+1-555-0106",
    address: "987 Cedar Ln, Someplace, USA",
  },
  {
    id: "P007",
    name: "Robert Taylor",
    dateOfBirth: "1975-06-18",
    gender: "male",
    email: "robert.taylor@email.com",
    phone: "+1-555-0107",
    address: "147 Birch Blvd, Elsewhere, USA",
  },
  {
    id: "P008",
    name: "Jennifer Martinez",
    dateOfBirth: "1995-01-25",
    gender: "female",
    email: "jennifer.martinez@email.com",
    phone: "+1-555-0108",
    address: "258 Spruce Way, Anywhere, USA",
  },
];

// Mock query functions
export async function findPatients(
  searchInput: PatientSearchInputType
): Promise<Patient[]> {
  // Simulate database query delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  let filteredPatients = [...mockPatients];

  // Filter by name if provided
  if (searchInput.name) {
    const searchName = searchInput.name.toLowerCase();
    filteredPatients = filteredPatients.filter((patient) =>
      patient.name.toLowerCase().includes(searchName)
    );
  }

  // Filter by exact date of birth if provided
  if (searchInput.dateOfBirth) {
    filteredPatients = filteredPatients.filter(
      (patient) => patient.dateOfBirth === searchInput.dateOfBirth
    );
  }

  // Filter by date of birth range if provided
  if (searchInput.dateOfBirthRange) {
    const { start, end } = searchInput.dateOfBirthRange;
    if (start || end) {
      filteredPatients = filteredPatients.filter((patient) => {
        const patientDate = new Date(patient.dateOfBirth);
        const startDate = start ? new Date(start) : null;
        const endDate = end ? new Date(end) : null;

        if (startDate && endDate) {
          return patientDate >= startDate && patientDate <= endDate;
        } else if (startDate) {
          return patientDate >= startDate;
        } else if (endDate) {
          return patientDate <= endDate;
        }
        return true;
      });
    }
  }

  // Filter by gender if provided
  if (searchInput.gender) {
    filteredPatients = filteredPatients.filter(
      (patient) => patient.gender === searchInput.gender
    );
  }

  // Filter by email if provided
  if (searchInput.email) {
    const searchEmail = searchInput.email.toLowerCase();
    filteredPatients = filteredPatients.filter((patient) =>
      patient.email?.toLowerCase().includes(searchEmail)
    );
  }

  // Filter by phone if provided
  if (searchInput.phone) {
    const searchPhone = searchInput.phone.replace(/\D/g, ""); // Remove non-digits
    filteredPatients = filteredPatients.filter((patient) =>
      patient.phone?.replace(/\D/g, "").includes(searchPhone)
    );
  }

  // Filter by address if provided
  if (searchInput.address) {
    const searchAddress = searchInput.address.toLowerCase();
    filteredPatients = filteredPatients.filter((patient) =>
      patient.address?.toLowerCase().includes(searchAddress)
    );
  }

  return filteredPatients;
}

export async function getPatientById(
  input: GetPatientInputType
): Promise<Patient | undefined> {
  // Simulate database query delay
  await new Promise((resolve) => setTimeout(resolve, 50));

  return mockPatients.find((patient) => patient.id === input.id);
}
