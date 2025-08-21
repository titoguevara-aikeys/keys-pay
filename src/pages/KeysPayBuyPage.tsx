import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpCircle, Shield, Clock, CreditCard } from "lucide-react";
import ComplianceFooter from "@/components/ComplianceFooter";

export default function KeysPayBuyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <ArrowUpCircle className="w-4 h-4 mr-2" />
            Powered by Ramp Network
          </Badge>
          <h1 className="text-4xl font-bold mb-4">Buy Crypto with Keys Pay</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Secure, fast, and compliant crypto on-ramp through our licensed provider network
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Buy Widget */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Buy Cryptocurrency
                </CardTitle>
                <CardDescription>
                  Purchase crypto using AED through our Ramp Network integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 rounded-lg p-8 text-center">
                  <ArrowUpCircle className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">Ramp Widget Integration</h3>
                  <p className="text-muted-foreground mb-6">
                    Connect your bank account or card to purchase cryptocurrency instantly
                  </p>
                  <Button size="lg" className="w-full">
                    Open Ramp Widget
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-4 bg-card rounded-lg border">
                    <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="font-medium">Regulated</div>
                    <div className="text-muted-foreground">Licensed provider</div>
                  </div>
                  <div className="text-center p-4 bg-card rounded-lg border">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="font-medium">Instant</div>
                    <div className="text-muted-foreground">Real-time settlement</div>
                  </div>
                  <div className="text-center p-4 bg-card rounded-lg border">
                    <CreditCard className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="font-medium">Secure</div>
                    <div className="text-muted-foreground">Bank-grade security</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Supported Assets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Bitcoin (BTC)</span>
                  <Badge variant="outline">Available</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Ethereum (ETH)</span>
                  <Badge variant="outline">Available</Badge>
                </div>
                <div className="flex justify-between">
                  <span>USDC</span>
                  <Badge variant="outline">Available</Badge>
                </div>
                <div className="flex justify-between">
                  <span>USDT</span>
                  <Badge variant="outline">Available</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>UAE Bank Transfer</span>
                  <Badge variant="secondary">AED</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Debit Card</span>
                  <Badge variant="secondary">Visa/MC</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Credit Card</span>
                  <Badge variant="secondary">Available</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="p-3 bg-primary/5 rounded-lg">
                  <div className="font-medium mb-1">Keys Pay Role</div>
                  <div className="text-muted-foreground">
                    Technology aggregator only - funds settle directly with Ramp Network
                  </div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="font-medium mb-1">Provider</div>
                  <div className="text-muted-foreground">
                    Ramp Network (EU licensed, MiCA compliant)
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <ComplianceFooter />
      </div>
    </div>
  );
}