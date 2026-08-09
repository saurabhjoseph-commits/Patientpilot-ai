export const Permissions = {
  DashboardRead: "dashboard.read", LeadsRead: "leads.read", LeadsCreate: "leads.create", LeadsUpdate: "leads.update", LeadsDelete: "leads.delete",
  PatientsRead: "patients.read", PatientsCreate: "patients.create", PatientsUpdate: "patients.update", PatientsDelete: "patients.delete",
  AppointmentsRead: "appointments.read", AppointmentsCreate: "appointments.create", AppointmentsUpdate: "appointments.update", AppointmentsCancel: "appointments.cancel",
  CallsRead: "calls.read", CallsManage: "calls.manage", AiRead: "ai.read", AiConfigure: "ai.configure", AnalyticsRead: "analytics.read",
  UsersRead: "users.read", UsersInvite: "users.invite", UsersUpdate: "users.update", UsersDeactivate: "users.deactivate", UsersManageRoles: "users.manage-roles",
  SettingsRead: "settings.read", SettingsUpdate: "settings.update", BillingRead: "billing.read", BillingManage: "billing.manage",
  ClinicRead: "clinic.read", ClinicUpdate: "clinic.update", AuditRead: "audit.read",
  DoctorsRead: "doctors.read", DoctorsCreate: "doctors.create", DoctorsUpdate: "doctors.update", DoctorsDeactivate: "doctors.deactivate", DoctorsDelete: "doctors.delete", DoctorsAssignServices: "doctors.assign-services", DoctorsManageGlobal: "doctors.manage-global",
  CalendarRead: "calendar.read", CalendarUpdate: "calendar.update", CalendarReadOwn: "calendar.read-own", CalendarUpdateOwn: "calendar.update-own", SchedulesRead: "schedules.read", SchedulesUpdate: "schedules.update", LeaveRead: "leave.read", LeaveUpdate: "leave.update", RoomsRead: "rooms.read", RoomsUpdate: "rooms.update",
} as const;

export type CatalogPermission = (typeof Permissions)[keyof typeof Permissions];

const allPermissions = Object.values(Permissions) as readonly CatalogPermission[];
export const DefaultRolePolicies: Readonly<Record<string, readonly CatalogPermission[]>> = {
  "super-admin": allPermissions,
  "clinic-owner": allPermissions.filter((permission) => permission !== Permissions.DoctorsManageGlobal && permission !== Permissions.DoctorsDelete),
  administrator: allPermissions,
  "practice-manager": [Permissions.DashboardRead, Permissions.LeadsRead, Permissions.LeadsCreate, Permissions.LeadsUpdate, Permissions.PatientsRead, Permissions.PatientsCreate, Permissions.PatientsUpdate, Permissions.AppointmentsRead, Permissions.AppointmentsCreate, Permissions.AppointmentsUpdate, Permissions.CallsRead, Permissions.AnalyticsRead, Permissions.DoctorsRead, Permissions.DoctorsCreate, Permissions.DoctorsUpdate, Permissions.DoctorsDeactivate, Permissions.DoctorsAssignServices, Permissions.CalendarRead, Permissions.CalendarUpdate, Permissions.SchedulesRead, Permissions.SchedulesUpdate, Permissions.LeaveRead, Permissions.LeaveUpdate, Permissions.RoomsRead, Permissions.RoomsUpdate, Permissions.ClinicRead],
  dentist: [Permissions.DashboardRead, Permissions.PatientsRead, Permissions.PatientsUpdate, Permissions.AppointmentsRead, Permissions.AppointmentsUpdate, Permissions.CalendarReadOwn, Permissions.CalendarUpdateOwn, Permissions.SchedulesRead, Permissions.LeaveRead],
  hygienist: [Permissions.DashboardRead, Permissions.PatientsRead, Permissions.PatientsUpdate, Permissions.AppointmentsRead, Permissions.AppointmentsUpdate],
  receptionist: [Permissions.DashboardRead, Permissions.LeadsRead, Permissions.LeadsCreate, Permissions.LeadsUpdate, Permissions.PatientsRead, Permissions.PatientsCreate, Permissions.AppointmentsRead, Permissions.AppointmentsCreate, Permissions.AppointmentsUpdate, Permissions.CallsRead, Permissions.DoctorsRead, Permissions.CalendarRead],
  support: [Permissions.DashboardRead, Permissions.UsersRead, Permissions.AuditRead],
  "ai-agent": [Permissions.AiRead],
};
