const productionHosts = new Set(["patientpilot-ai.com", "www.patientpilot-ai.com"]);

export function assertExecutionSafety({ target, baseUrl, writesRequested, allowStagingWrites }) {
  const hostname = new URL(baseUrl).hostname.toLowerCase();
  if (writesRequested && productionHosts.has(hostname)) throw new Error("production host");
  if (target === "production" && writesRequested) throw new Error("read-only");
  if (writesRequested && (target !== "staging" || !allowStagingWrites)) throw new Error("explicit staging guard");
}

export class AdminE2EHarness {
  constructor() {
    this.rows = { patients: [], appointments: [], calls: [], messages: [] };
  }
  seed(table, row) { this.rows[table].push({ ...row }); }
  list(table, principal, clinicId = principal.clinicId) {
    if (clinicId !== principal.clinicId && !principal.stagingGlobal) throw new Error("cross-clinic denied");
    return this.rows[table].filter((row) => row.clinicId === clinicId);
  }
  get(table, id, principal) {
    const row = this.rows[table].find((candidate) => candidate.id === id && candidate.clinicId === principal.clinicId);
    if (!row) throw new Error("record denied");
    return row;
  }
  createSynthetic(table, principal, row) {
    if (!principal.stagingGlobal || !row.isTest || row.source !== "agent12-e2e") throw new Error("synthetic write denied");
    this.seed(table, row);
    return row;
  }
  cleanup(table, principal, id) {
    const row = this.rows[table].find((candidate) => candidate.id === id);
    if (!principal.stagingGlobal || !row?.isTest || row.source !== "agent12-e2e") throw new Error("cleanup denied");
    this.rows[table] = this.rows[table].filter((candidate) => candidate.id !== id);
  }
}
