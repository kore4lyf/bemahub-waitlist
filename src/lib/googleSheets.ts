const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

if (!APPS_SCRIPT_URL) {
  throw new Error("APPS_SCRIPT_URL environment variable is not set");
}

export async function appendToSheet(values: (string | number)[]) {
  const response = await fetch(APPS_SCRIPT_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: String(values[0]),
      lastName: String(values[1]),
      email: String(values[2]),
      phone: String(values[3]),
      location: String(values[4]),
      referrerName: String(values[5]),
      referrerPhone: String(values[6]),
      referrerEmail: String(values[7]),
      timestamp: String(values[8]),
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to submit form: ${response.statusText}`);
  }

  return response.text();
}

export async function getRegisteredUsers() {
  try {
    const response = await fetch(`${APPS_SCRIPT_URL!}?action=getUsers`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching registered users:", error);
    throw error;
  }
}
