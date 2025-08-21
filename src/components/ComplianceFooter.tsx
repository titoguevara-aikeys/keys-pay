import React from 'react';

const ComplianceFooter: React.FC = () => {
  return (
    <footer className="mt-8 py-4 border-t border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>
            <strong>Aggregated by Keys Pay</strong> (DED License No. 1483958, CR No. 2558995)
          </p>
          <p>
            Keys Pay is a technology platform operating as an aggregator under Dubai DED Commercial License 
            (No. 1483958, CR No. 2558995). All regulated financial services are provided directly by licensed 
            third-party providers (Transak, Nium). Keys Pay does not custody client funds, issue financial 
            products, or act as Merchant of Record.
          </p>
          <div className="flex justify-center items-center space-x-4 mt-4">
            <span className="text-xs">Powered by</span>
            <div className="flex space-x-2">
              <span className="px-2 py-1 bg-muted rounded text-xs">Transak</span>
              <span className="px-2 py-1 bg-muted rounded text-xs">Nium</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ComplianceFooter;