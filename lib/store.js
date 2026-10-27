import fs from "fs";
import path from "path";
import os from "os";

const DB_FILE = path.join(os.tmpdir(), "can-i-afford-capstone-db.json");

const INITIAL_DATA = {
  users: [
    {
      id: "usr_demo",
      name: "Lamesgnew (Demo)",
      username: "demo_user",
      password: "peace123",
      currentLocation: "California",
      baselineSalary: 95000,
    },
    {
      id: "usr_other",
      name: "Other Resident",
      username: "other_user",
      password: "secret123",
      currentLocation: "New York",
      baselineSalary: 110000,
    },
  ],
  calculations: [
    {
      id: "rec_other_2",
      userId: "usr_other",
      salary: 110000,
      requiredSalary: 98000,
      percentageDiff: -11,
      locationA: {
        searchedLocation: "New York",
        costIndex: 118,
        description: "18% above average",
        cpi: 395.276,
        usAverageCPI: 334.98,
        period: "2026-08",
      },
      locationB: {
        searchedLocation: "Florida",
        costIndex: 101,
        description: "1% above average",
        cpi: 338.329,
        usAverageCPI: 334.98,
        period: "2026-08",
      },
    },
  ],
};

export function readDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf8");
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.users) && Array.isArray(parsed.calculations)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Read DB fallback:", e.message);
  }
  writeDb(INITIAL_DATA);
  return JSON.parse(JSON.stringify(INITIAL_DATA));
}

export function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    console.warn("Write DB warning:", e.message);
  }
}

// Keep backwards-compatible export if any file imports `db`
export const db = readDb();