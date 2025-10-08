import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle } from "lucide-react";

export interface CoachCardProps {
  title: string;
  copy: string;
  cta: string;
  shariah?: {
    compatible: boolean;
    notes?: string;
    alternative?: string;
    flags?: string[];
  };
  onAction?: () => void;
}

export const CoachCard: React.FC<CoachCardProps> = ({
  title,
  copy,
  cta,
  shariah,
  onAction
}) => {
  const halalCTA = shariah && !shariah.compatible && shariah.alternative
    ? shariah.alternative
    : cta;

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
          {shariah?.compatible && (
            <CheckCircle className="h-5 w-5 text-green-600" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="whitespace-pre-wrap text-base">
          {copy}
        </CardDescription>

        {shariah && !shariah.compatible && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              ⚠️ Original version not Shariah-compliant — showing halal alternative.
              {shariah.flags && shariah.flags.length > 0 && (
                <div className="mt-1 text-xs">
                  Prohibited elements: {shariah.flags.join(", ")}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {shariah?.alternative && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {shariah.alternative}
            </AlertDescription>
          </Alert>
        )}

        {shariah?.notes && (
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
            {shariah.notes}
          </div>
        )}

        <Button
          onClick={onAction}
          className="w-full"
          variant={shariah?.compatible === false ? "outline" : "default"}
        >
          {halalCTA}
        </Button>
      </CardContent>
    </Card>
  );
};
