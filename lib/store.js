const globalStore = globalThis;
if (!globalStore.__CAN_I_AFFORD_STORE__) {
  globalStore.__CAN_I_AFFORD_STORE__ = {
    users: [
      { id: "usr_demo", name: "Lamesgnew", username: "demo_user", password: "peace123", currentLocation: "California", baselineSalary: 95000 },
      { id: "usr_other", name: "Other Resident", username: "other_user", password: "secret123", currentLocation: "New York", baselineSalary: 110000 }
    ],
    calculations: [
      {
        id: "rec_demo_1", userId: "usr_demo", salary: 95000, requiredSalary: 81682, percentageDiff: -14,
        locationA: { searchedLocation: "California", costIndex: 107, description: "7% above average", cpi: 356.993, usAverageCPI: 334.98, period: "2026-08" },
        locationB: { searchedLocation: "Texas", costIndex: 92, description: "8% below average", cpi: 308.182, usAverageCPI: 334.98, period: "2026-08" }
      },
      {
        id: "rec_other_2", userId: "usr_other", salary: 110000, requiredSalary: 98000, percentageDiff: -11,
        locationA: { searchedLocation: "New York", costIndex: 118, description: "18% above average", cpi: 395.276, usAverageCPI: 334.98, period: "2026-08" },
        locationB: { searchedLocation: "Florida", costIndex: 101, description: "1% above average", cpi: 338.329, usAverageCPI: 334.98, period: "2026-08" }
      }
    ]
  };
}
export const db = globalStore.__CAN_I_AFFORD_STORE__;