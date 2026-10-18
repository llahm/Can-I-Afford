import { NextResponse } from "next/server";
import { fetchCostLivingByLocation } from "@/lib/api-adapter";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const locA = searchParams.get("locationA") || "";
  const locB = searchParams.get("locationB") || "";
  const salary = parseFloat(searchParams.get("salary") || "0");

  if (!locA.trim() || !locB.trim() || Number.isNaN(salary) || salary < 1000) {
    return NextResponse.json(
      { error: "Please enter two valid locations and an annual income of at least $1,000." },
      { status: 400 }
    );
  }

  try {
    const [locationA, locationB] = await Promise.all([
      fetchCostLivingByLocation(locA),
      fetchCostLivingByLocation(locB),
    ]);

    const requiredSalary = salary * (locationB.costIndex / locationA.costIndex);
    const percentageDiff = Math.round(
      ((locationB.costIndex - locationA.costIndex) / locationA.costIndex) * 100
    );
    const purchasingPowerGain = Math.max(0, salary - requiredSalary);

    return NextResponse.json({
      locationA,
      locationB,
      salary,
      requiredSalary,
      percentageDiff,
      purchasingPowerGain,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}