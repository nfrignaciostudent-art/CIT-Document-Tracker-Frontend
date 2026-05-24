export type DocStatus =
  | "Received"
  | "Processing"
  | "For Approval"
  | "Approved"
  | "Released"
  | "Rejected";

export type Document = {
  internalId: string;
  displayId: string;
  verifyCode: string;
  name: string;
  owner: string;
  department: string;
  status: DocStatus;
  createdAt: string;
  updatedAt: string;
  hasProcessedFile: boolean;
};

export type ScanLog = {
  id: string;
  internalId: string;
  displayId: string;
  at: string;
  ip: string;
  userAgent: string;
};

export type Movement = {
  id: string;
  internalId: string;
  displayId: string;
  at: string;
  from: string;
  to: string;
  note: string;
  by: string;
};

export type UserRole = "admin" | "staff" | "faculty" | "student";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  online: boolean;
  lastSeen: string;
};


export type Notification = {
  id: string;
  title: string;
  body: string;
  at: string;
  read: boolean;
};

const fullId = (d: Document) => `${d.displayId}-${d.verifyCode}`;
export const getFullDisplayId = fullId;

const now = Date.now();
const daysAgo = (n: number) => new Date(now - n * 86400000).toISOString();
const hoursAgo = (n: number) => new Date(now - n * 3600000).toISOString();

export const documents: Document[] = [
  { internalId: "01HZX1A2B3C4D5E6F7G8H9J0K1", displayId: "DOC-20260418-0001", verifyCode: "A7F2", name: "Capstone Project Proposal · J. Cruz", owner: "Juan Cruz", department: "IT Department Office", status: "Released", createdAt: daysAgo(12), updatedAt: hoursAgo(3), hasProcessedFile: true },
  { internalId: "01HZX2A2B3C4D5E6F7G8H9J0K2", displayId: "DOC-20260418-0002", verifyCode: "B3D1", name: "Certificate of Enrollment · BSIT 3A", owner: "Maria Santos", department: "IT Department Office", status: "Approved", createdAt: daysAgo(10), updatedAt: hoursAgo(8), hasProcessedFile: false },
  { internalId: "01HZX3A2B3C4D5E6F7G8H9J0K3", displayId: "DOC-20260419-0003", verifyCode: "C9E4", name: "Thesis Defense Endorsement", owner: "Pedro Reyes", department: "Dean of IT", status: "For Approval", createdAt: daysAgo(8), updatedAt: hoursAgo(20), hasProcessedFile: false },
  { internalId: "01HZX4A2B3C4D5E6F7G8H9J0K4", displayId: "DOC-20260419-0004", verifyCode: "D5A8", name: "Good Moral Certificate · BSIT", owner: "Ana Lim", department: "IT Student Services", status: "Processing", createdAt: daysAgo(7), updatedAt: hoursAgo(30), hasProcessedFile: false },
  { internalId: "01HZX5A2B3C4D5E6F7G8H9J0K5", displayId: "DOC-20260420-0005", verifyCode: "E1F9", name: "Specialization Track Application", owner: "Carlo Dela Peña", department: "Dean of IT", status: "Received", createdAt: daysAgo(5), updatedAt: daysAgo(5), hasProcessedFile: false },
  { internalId: "01HZX6A2B3C4D5E6F7G8H9J0K6", displayId: "DOC-20260421-0006", verifyCode: "F8C3", name: "OJT Endorsement Letter · IT", owner: "Sofia Garcia", department: "IT OJT Coordinator", status: "Released", createdAt: daysAgo(20), updatedAt: daysAgo(2), hasProcessedFile: true },
  { internalId: "01HZX7A2B3C4D5E6F7G8H9J0K7", displayId: "DOC-20260422-0007", verifyCode: "G4B7", name: "Subject Substitution · IT Elective", owner: "Luis Tan", department: "IT Department Office", status: "Rejected", createdAt: daysAgo(4), updatedAt: hoursAgo(40), hasProcessedFile: false },
  { internalId: "01HZX8A2B3C4D5E6F7G8H9J0K8", displayId: "DOC-20260423-0008", verifyCode: "H2D6", name: "IT Faculty Load Memo", owner: "Bea Robles", department: "IT Faculty Room", status: "Processing", createdAt: daysAgo(3), updatedAt: hoursAgo(10), hasProcessedFile: false },
  { internalId: "01HZX9A2B3C4D5E6F7G8H9J0K9", displayId: "DOC-20260423-0009", verifyCode: "J6E5", name: "Lab Access Request · DevOps Room", owner: "Mark Villanueva", department: "IT Laboratory", status: "Approved", createdAt: daysAgo(2), updatedAt: hoursAgo(6), hasProcessedFile: false },
  { internalId: "01HZXAA2B3C4D5E6F7G8H9J0KA", displayId: "DOC-20260424-0010", verifyCode: "K3F1", name: "Authority to Take Comprehensive Exam", owner: "Riza Mendoza", department: "Dean of IT", status: "For Approval", createdAt: daysAgo(1), updatedAt: hoursAgo(4), hasProcessedFile: false },
];


export const scanLogs: ScanLog[] = [
  { id: "s1", internalId: documents[0].internalId, displayId: documents[0].displayId, at: hoursAgo(1), ip: "192.168.1.21", userAgent: "Chrome on Android" },
  { id: "s2", internalId: documents[5].internalId, displayId: documents[5].displayId, at: hoursAgo(2), ip: "192.168.1.45", userAgent: "Safari on iPhone" },
  { id: "s3", internalId: documents[2].internalId, displayId: documents[2].displayId, at: hoursAgo(5), ip: "192.168.1.7", userAgent: "Chrome on Windows" },
  { id: "s4", internalId: documents[0].internalId, displayId: documents[0].displayId, at: hoursAgo(12), ip: "192.168.1.21", userAgent: "Chrome on Android" },
  { id: "s5", internalId: documents[8].internalId, displayId: documents[8].displayId, at: hoursAgo(18), ip: "192.168.1.66", userAgent: "Firefox on Mac" },
];

export const movements: Movement[] = [
  { id: "m1", internalId: documents[0].internalId, displayId: documents[0].displayId, at: hoursAgo(3), from: "IT Department Office", to: "Released to Owner", note: "Picked up by student", by: "admin" },
  { id: "m2", internalId: documents[2].internalId, displayId: documents[2].displayId, at: hoursAgo(20), from: "Dean of IT", to: "VPAA Office", note: "Forwarded for signature", by: "admin" },
  { id: "m3", internalId: documents[3].internalId, displayId: documents[3].displayId, at: hoursAgo(30), from: "IT Student Services", to: "IT Department Office", note: "Routed for verification", by: "admin" },
  { id: "m4", internalId: documents[7].internalId, displayId: documents[7].displayId, at: hoursAgo(10), from: "IT Faculty Room", to: "Dean of IT", note: "Awaiting endorsement", by: "admin" },
];

export const users: UserRow[] = [
  { id: "u1", name: "Admin Office", email: "admin@cit.edu", role: "admin", online: true, lastSeen: hoursAgo(0.1) },
  { id: "u2", name: "Juan Cruz", email: "jcruz@cit.edu", role: "student", online: true, lastSeen: hoursAgo(0.2) },
  { id: "u3", name: "Maria Santos", email: "msantos@cit.edu", role: "student", online: false, lastSeen: hoursAgo(2) },
  { id: "u4", name: "Prof. Pedro Reyes", email: "preyes@cit.edu", role: "faculty", online: true, lastSeen: hoursAgo(0.3) },
  { id: "u5", name: "Ana Lim", email: "alim@cit.edu", role: "staff", online: false, lastSeen: hoursAgo(8) },
  { id: "u6", name: "Carlo Dela Peña", email: "cdelapena@cit.edu", role: "student", online: true, lastSeen: hoursAgo(0.5) },
  { id: "u7", name: "Dr. Bea Robles", email: "brobles@cit.edu", role: "faculty", online: false, lastSeen: hoursAgo(5) },
  { id: "u8", name: "Sofia Garcia", email: "sgarcia@cit.edu", role: "staff", online: true, lastSeen: hoursAgo(0.4) },
];


export const notifications: Notification[] = [
  { id: "n1", title: "Document released", body: `${fullId(documents[0])} is ready for pickup.`, at: hoursAgo(3), read: false },
  { id: "n2", title: "Awaiting your approval", body: `${fullId(documents[2])} needs Dean's signature.`, at: hoursAgo(20), read: false },
  { id: "n3", title: "Scan recorded", body: `${fullId(documents[5])} was scanned at the OJT Office.`, at: hoursAgo(2), read: true },
  { id: "n4", title: "Document rejected", body: `${fullId(documents[6])} was rejected, see notes.`, at: hoursAgo(40), read: true },
];

export function findByInternalId(id: string) {
  return documents.find((d) => d.internalId === id);
}

/** Lookup a document by internalId, displayId, or full "displayId-verifyCode" string (case-insensitive). */
export function findDocument(raw: string) {
  const q = raw.trim().toUpperCase();
  if (!q) return undefined;
  return documents.find(
    (d) =>
      d.internalId.toUpperCase() === q ||
      d.displayId.toUpperCase() === q ||
      `${d.displayId}-${d.verifyCode}`.toUpperCase() === q ||
      d.verifyCode.toUpperCase() === q,
  );
}

export function statusOrder(): DocStatus[] {
  return ["Received", "Processing", "For Approval", "Approved", "Released", "Rejected"];
}

export function statusCounts() {
  const order = statusOrder();
  return order.map((status) => ({
    status,
    count: documents.filter((d) => d.status === status).length,
  }));
}

/** Registrations per day for the last `days` days (inclusive of today). */
export function registrationsTrend(days = 14) {
  const buckets: { date: string; label: string; count: number }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000);
    const key = d.toISOString().slice(0, 10);
    buckets.push({
      date: key,
      label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      count: 0,
    });
  }
  for (const doc of documents) {
    const key = doc.createdAt.slice(0, 10);
    const b = buckets.find((x) => x.date === key);
    if (b) b.count += 1;
  }
  return buckets;
}

/** Document volume grouped by department, sorted desc. */
export function departmentCounts() {
  const map = new Map<string, number>();
  for (const d of documents) map.set(d.department, (map.get(d.department) ?? 0) + 1);
  return Array.from(map, ([department, count]) => ({ department, count })).sort(
    (a, b) => b.count - a.count,
  );
}
