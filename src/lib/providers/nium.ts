export async function quote(params: any) {
  return {
    quoteId: "q_demo",
    rate: 1.0,
    fee: 5,
    ttlSeconds: 120
  };
}

export async function execute({ quoteId, reference, metadata }: any) {
  return {
    provider: "NIUM",
    ref: `pay_${quoteId}`,
    status: "processing",
    updatedAt: new Date().toISOString()
  };
}

export async function issueCard(params: any) {
  return {
    cardId: "card_demo",
    last4: "1234",
    activationUrl: "https://nium.example/activate"
  };
}

export async function controls(params: any) {
  return { ok: true };
}

export function mapPayoutStatus(niumStatus: string): 'processing' | 'completed' | 'failed' {
  switch (niumStatus.toLowerCase()) {
    case 'completed':
    case 'success':
      return 'completed';
    case 'failed':
    case 'rejected':
      return 'failed';
    default:
      return 'processing';
  }
}