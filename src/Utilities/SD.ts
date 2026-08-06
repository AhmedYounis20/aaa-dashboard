export const EMPTY_UUID = "00000000-0000-0000-0000-000000000000";

function requireEnv(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error(
      `${name} is not defined. Copy .env.example to .env.development and set the required values.`
    );
  }
  return value;
}

const baseUrl = requireEnv("VITE_API_BASE_URL");
const payableNotesId = requireEnv("VITE_PAYABLE_NOTES_ID");
const receivableNotesId = requireEnv("VITE_RECEIVABLE_NOTES_ID");

export { baseUrl, payableNotesId, receivableNotesId };
