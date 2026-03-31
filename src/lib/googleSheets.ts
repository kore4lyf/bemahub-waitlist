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
    const url = `${APPS_SCRIPT_URL!}?action=getUsers`;
    console.log("Fetching from URL:", url);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response:", text);
      const match = text.match(/TypeError: ([^<]+)/);
      throw new Error(`Apps Script error: ${match ? match[1].trim() : "Invalid response"}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching registered users:", error);
    throw error;
  }
}
