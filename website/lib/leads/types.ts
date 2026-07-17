export interface Lead {
  id: number;

  clinicName: string;
  dentistName: string;

  email: string;
  phone: string;

  monthlyCalls: number;

  message?: string | null;

  status: string;

  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateLeadRequest {
  clinicName: string;
  dentistName: string;

  email: string;
  phone: string;

  monthlyCalls: number;

  message?: string;
}