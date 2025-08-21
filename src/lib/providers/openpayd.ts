export async function applyAccount() {
  throw new Error("OPENPAYD_DISABLED");
}

export async function getAccount(accountId: string) {
  throw new Error("OPENPAYD_DISABLED");
}

export async function verifyWebhook(payload: string, signature: string): Promise<boolean> {
  throw new Error("OPENPAYD_DISABLED");
}