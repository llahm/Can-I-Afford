import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { fetchCostLivingByLocation } from "@/lib/api-adapter";

const CANDIDATES = ["North Carolina", "Tennessee", "Ohio", "Texas", "Oregon", "Colorado", "Florida"];

export async function GET(request) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = Date.now();
  const dayEpoch = Math.floor(now / 86400000);
  const hoursUntilNextMatch = 24 - new Date(now).getUTCHours();
  const idx = (dayEpoch + (user.username?.length || 0)) % CANDIDATES.length;

  const [origin, matchLoc] = await Promise.all([
    fetchCostLivingByLocation(user.currentLocation || "California"),
    fetchCostLivingByLocation(CANDIDATES[idx])
  ]);

  const baselineSalary = Number(user.baselineSalary) || 85000;
  const equivalentSalaryNeeded = baselineSalary * (matchLoc.costIndex / origin.costIndex);
  const annualSavingsMargin = Math.max(0, baselineSalary - equivalentSalaryNeeded);

  return NextResponse.json({
    refreshedDate: new Date(now).toISOString().slice(0, 10),
    hoursUntilNextMatch,
    userCurrentLocation: origin.searchedLocation,
    userBaselineSalary: baselineSalary,
    location: matchLoc,
    equivalentSalaryNeeded,
    annualSavingsMargin
  });
}