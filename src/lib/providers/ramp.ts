export async function createSession(input: any) {
  // TODO: call Ramp REST/construct widget URL with API key
  return {
    provider: "RAMP",
    sessionId: "sess_demo",
    checkoutUrl: "https://ramp.example/checkout",
    ref: "ramp-ref-demo"
  };
}

export async function verifyWebhook(payload: string, signature: string): Promise<boolean> {
  // TODO: implement Ramp webhook verification
  return true;
}

export function mapEventStatus(rampStatus: string): 'created' | 'authorized' | 'completed' | 'failed' {
  switch (rampStatus.toLowerCase()) {
    case 'completed':
      return 'completed';
    case 'failed':
    case 'cancelled':
      return 'failed';
    case 'authorized':
      return 'authorized';
    default:
      return 'created';
  }
}