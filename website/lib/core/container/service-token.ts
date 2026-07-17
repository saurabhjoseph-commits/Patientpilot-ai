export const ServiceTokens = {
  Logger: Symbol("Logger"),

  AppointmentRepository: Symbol("AppointmentRepository"),

  AppointmentService: Symbol("AppointmentService"),

  PatientRepository: Symbol("PatientRepository"),

  PatientService: Symbol("PatientService"),

  AIService: Symbol("AIService"),

  FeatureService: Symbol("FeatureService"),
} as const;