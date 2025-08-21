import React from 'react';

const ComplianceFooter: React.FC = () => {
  return (
    <footer className="mt-8 py-6 border-t border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center text-sm text-muted-foreground space-y-3">
          <p className="font-semibold text-foreground">
            <strong>Keys Pay operates under AIKEYS (Trade License 1483958, CR 2558995, DED Dubai)</strong>
          </p>
          <p className="max-w-4xl mx-auto">
            Keys Pay is an aggregator platform. All payments, custody, and settlement 
            are executed by regulated third-party providers.
          </p>
          <p className="max-w-4xl mx-auto">
            Keys Pay does not take custody of client funds or crypto assets.
          </p>
          <div className="flex justify-center items-center space-x-6 mt-4">
            <span className="text-xs font-medium">Powered by:</span>
            <div className="flex space-x-3">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                Ramp
              </span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                Nium
              </span>
              <span className="px-3 py-1 bg-muted rounded-full text-xs">
                OpenPayd (Coming Soon)
              </span>
            </div>
          </div>
          <div className="text-xs opacity-75 mt-4">
            Trade License: 1483958 | CR: 2558995 | Reference Code: 12345 | Dubai DED
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ComplianceFooter;