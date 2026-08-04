import { sleep } from "@/lib/utils";
import type { ContactFormValues } from "./schema";

/**
 * There is no inbox. This resolves after a beat so the button's pending state
 * is real, and nothing is stored, sent or logged.
 */
export async function sendContactMessage(
  values: ContactFormValues,
): Promise<{ receivedAt: string; name: string }> {
  await sleep(420);
  return { receivedAt: new Date().toISOString(), name: values.name };
}
