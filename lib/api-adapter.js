/**
 * Live-Only ApiVerve Cost of Living Adapter
 * Endpoint: GET https://api.apiverve.com/v1/costliving?location=...
 * Header: x-api-key
 */
export async function fetchCostLivingByLocation(locationQuery) {
  const clean = (locationQuery || '').trim();
  if (!clean) {
    throw new Error('Location parameter is required.');
  }

  const apiKey = process.env.APIVERVE_API_KEY;
  if (!apiKey || apiKey === 'your_apiverve_api_key_here') {
    throw new Error('Missing APIVERVE_API_KEY in .env.local');
  }

  const url = `https://api.apiverve.com/v1/costliving?location=${encodeURIComponent(clean)}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'x-api-key': apiKey,
      'Accept': 'application/json',
    },
    // Cache live response for 24 hours per DATA.md rubric
    next: { revalidate: 86400 },
  });

  const remainingCredits = res.headers.get('x-api-remaining-credits');
  const json = await res.json().catch(() => ({}));

  if (!res.ok || json.status !== 'ok' || !json.data) {
    // Surfaces exact ApiVerve 400 / 401 / 403 / 429 error reason
    throw new Error(
      json.error || `ApiVerve Error (HTTP ${res.status}) for location "${clean}".`
    );
  }

  const d = json.data;
  const out = {
    searchedLocation: d.searchedLocation,
    costIndex: d.costIndex,
    description: d.description,
    cpi: d.cpi,
    usAverageCPI: d.usAverageCPI,
    period: d.period,
    note: d.note,
    remainingCredits: remainingCredits || null,
  };

  // Optional premium fields checked for presence per ApiVerve spec
  if ('region' in d && d.region) out.region = d.region;
  if ('regionName' in d && d.regionName) out.regionName = d.regionName;

  return out;
}