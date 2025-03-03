import { TaxReport } from './TaxCalculationService';
import PDFDocument from 'pdfkit';

/**
 * Service for generating tax report exports in various formats
 */
class ExportService {
  /**
   * Generate a CSV export in the general format
   */
  generateGeneralCSV(taxReport: TaxReport): string {
    // Initialize CSV string with headers
    let csv = 'Date Sold,Date Acquired,Asset,Amount,Sale Value (USD),Cost Basis (USD),Gain/Loss (USD),Long Term\n';
    
    // Sort gains by date sold
    const sortedGains = [...taxReport.transactions.gains].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );
    
    // Add each gain as a row in the CSV
    sortedGains.forEach(gain => {
      const dateSold = gain.timestamp.toISOString().split('T')[0];
      const dateAcquired = gain.acquiredAt.toISOString().split('T')[0];
      const isLongTerm = gain.isLongTerm ? 'Yes' : 'No';
      
      csv += `${dateSold},${dateAcquired},${gain.asset},${gain.soldAmount.toFixed(8)},${gain.soldValue.toFixed(2)},${gain.costBasis.toFixed(2)},${gain.gainLoss.toFixed(2)},${isLongTerm}\n`;
    });
    
    return csv;
  }

  /**
   * Generate a CSV export in TurboTax format
   */
  generateTurboTaxCSV(taxReport: TaxReport): string {
    // TurboTax format headers
    let csv = 'Description,Date Acquired,Date Sold,Proceeds,Cost Basis,Wash Sale Loss Disallowed,Gain Or Loss,Term\n';
    
    const sortedGains = [...taxReport.transactions.gains].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );
    
    sortedGains.forEach(gain => {
      const description = `${gain.soldAmount.toFixed(8)} ${gain.asset}`;
      const dateAcquired = gain.acquiredAt.toISOString().split('T')[0];
      const dateSold = gain.timestamp.toISOString().split('T')[0];
      const proceeds = gain.soldValue.toFixed(2);
      const costBasis = gain.costBasis.toFixed(2);
      const washSale = '0.00';
      const gainLoss = gain.gainLoss.toFixed(2);
      const term = gain.isLongTerm ? 'Long' : 'Short';
      
      csv += `${description},${dateAcquired},${dateSold},${proceeds},${costBasis},${washSale},${gainLoss},${term}\n`;
    });
    
    return csv;
  }

  /**
   * Generate a CSV export in H&R Block format
   */
  generateHRBlockCSV(taxReport: TaxReport): string {
    // H&R Block format headers
    let csv = 'Asset Name,Purchase Date,Cost Basis,Date Sold,Proceeds,Gain/Loss,Term\n';
    
    const sortedGains = [...taxReport.transactions.gains].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );
    
    sortedGains.forEach(gain => {
      const assetName = `${gain.soldAmount.toFixed(8)} ${gain.asset}`;
      const purchaseDate = gain.acquiredAt.toISOString().split('T')[0];
      const costBasis = gain.costBasis.toFixed(2);
      const dateSold = gain.timestamp.toISOString().split('T')[0];
      const proceeds = gain.soldValue.toFixed(2);
      const gainLoss = gain.gainLoss.toFixed(2);
      const term = gain.isLongTerm ? 'Long Term' : 'Short Term';
      
      csv += `${assetName},${purchaseDate},${costBasis},${dateSold},${proceeds},${gainLoss},${term}\n`;
    });
    
    return csv;
  }

  /**
   * Generate a CSV export in Koinly format
   */
  generateKoinlyCSV(taxReport: TaxReport): string {
    // Koinly format headers
    let csv = 'Date,Sent Amount,Sent Currency,Received Amount,Received Currency,Fee Amount,Fee Currency,Net Worth Amount,Net Worth Currency,Label,Description,TxHash\n';
    
    // Sort all trades by timestamp
    const sortedTrades = [...taxReport.transactions.trades].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );
    
    sortedTrades.forEach(trade => {
      // For simplicity, we're treating all trades as sales
      const date = trade.timestamp.toISOString();
      const sentAmount = trade.amount.toFixed(8);
      const sentCurrency = trade.asset;
      const receivedAmount = trade.value.toFixed(2);
      const receivedCurrency = 'USD';
      const feeAmount = '0';
      const feeCurrency = 'USD';
      const netWorthAmount = trade.value.toFixed(2);
      const netWorthCurrency = 'USD';
      const label = 'Sell';
      const description = `Sold ${sentAmount} ${sentCurrency}`;
      const txHash = trade.txHash;
      
      csv += `${date},${sentAmount},${sentCurrency},${receivedAmount},${receivedCurrency},${feeAmount},${feeCurrency},${netWorthAmount},${netWorthCurrency},${label},${description},${txHash}\n`;
    });
    
    return csv;
  }

  /**
   * Generate a CSV export in CoinTracker format
   */
  generateCoinTrackerCSV(taxReport: TaxReport): string {
    // CoinTracker format headers
    let csv = 'Date,Type,Received Quantity,Received Currency,Sent Quantity,Sent Currency,Fee,Fee Currency,Exchange,Tag\n';
    
    // Sort all trades by timestamp
    const sortedTrades = [...taxReport.transactions.trades].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );
    
    sortedTrades.forEach(trade => {
      const date = trade.timestamp.toISOString().split('T')[0];
      const type = 'Sell';
      const receivedQuantity = trade.value.toFixed(2);
      const receivedCurrency = 'USD';
      const sentQuantity = trade.amount.toFixed(8);
      const sentCurrency = trade.asset;
      const fee = '0';
      const feeCurrency = 'USD';
      const exchange = 'Arbitrum One';
      const tag = '';
      
      csv += `${date},${type},${receivedQuantity},${receivedCurrency},${sentQuantity},${sentCurrency},${fee},${feeCurrency},${exchange},${tag}\n`;
    });
    
    return csv;
  }

  /**
   * Generate a CSV export in TaxAct format
   */
  generateTaxActCSV(taxReport: TaxReport): string {
    // TaxAct format headers
    let csv = 'Security Description,Date Acquired,Date Sold,Sales Price,Cost or Other Basis,Codes,Amount of Adjustment,Gain or Loss\n';
    
    const sortedGains = [...taxReport.transactions.gains].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );
    
    sortedGains.forEach(gain => {
      const description = `${gain.soldAmount.toFixed(8)} ${gain.asset}`;
      const dateAcquired = gain.acquiredAt.toISOString().split('T')[0];
      const dateSold = gain.timestamp.toISOString().split('T')[0];
      const salesPrice = gain.soldValue.toFixed(2);
      const costBasis = gain.costBasis.toFixed(2);
      const codes = gain.isLongTerm ? 'L' : 'S';
      const adjustment = '0.00';
      const gainLoss = gain.gainLoss.toFixed(2);
      
      csv += `${description},${dateAcquired},${dateSold},${salesPrice},${costBasis},${codes},${adjustment},${gainLoss}\n`;
    });
    
    return csv;
  }

  /**
   * Generate a CSV based on the selected template
   */
  generateCSV(taxReport: TaxReport, templateId: string): string {
    switch (templateId) {
      case 'turbotax':
        return this.generateTurboTaxCSV(taxReport);
      case 'hrblock':
        return this.generateHRBlockCSV(taxReport);
      case 'koinly':
        return this.generateKoinlyCSV(taxReport);
      case 'cointracker':
        return this.generateCoinTrackerCSV(taxReport);
      case 'taxact':
        return this.generateTaxActCSV(taxReport);
      case 'general':
      default:
        return this.generateGeneralCSV(taxReport);
    }
  }

  /**
   * Generate a PDF of the tax report
   */
  generatePDF(taxReport: TaxReport): Buffer {
    return new Promise<Buffer>((resolve, reject) => {
      try {
        // Create a PDF document
        const doc = new PDFDocument({ 
          margin: 50,
          size: 'A4'
        });
        
        // Store PDF as buffer
        const chunks: Buffer[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        
        // Add title
        doc.fontSize(20).font('Helvetica-Bold')
          .text('Crypto Tax Report', { align: 'center' });
        
        doc.moveDown();
        doc.fontSize(12).font('Helvetica')
          .text(`Wallet ID: ${taxReport.walletId}`, { align: 'left' });
        
        doc.moveDown(0.5);
        doc.text(`Report Period: ${this.formatDate(taxReport.startDate)} to ${this.formatDate(taxReport.endDate)}`, { align: 'left' });
        
        doc.moveDown(0.5);
        doc.text(`Calculation Method: ${taxReport.method.toUpperCase()}`, { align: 'left' });
        
        doc.moveDown(1);
        
        // Summary section
        doc.fontSize(16).font('Helvetica-Bold')
          .text('Summary', { underline: true });
        doc.moveDown(0.5);
        
        doc.fontSize(12).font('Helvetica');
        doc.text(`Short Term Gains: $${taxReport.shortTermGains.toFixed(2)}`, { align: 'left' });
        doc.moveDown(0.5);
        doc.text(`Long Term Gains: $${taxReport.longTermGains.toFixed(2)}`, { align: 'left' });
        doc.moveDown(0.5);
        doc.text(`Total Gains: $${taxReport.totalGains.toFixed(2)}`, { align: 'left' });
        
        doc.moveDown(1);
        
        // Transactions section
        doc.fontSize(16).font('Helvetica-Bold')
          .text('Capital Gains', { underline: true });
        doc.moveDown(0.5);
        
        // Create a table for capital gains
        const tableTop = doc.y;
        const tableLeft = 50;
        const colWidths = [80, 80, 60, 70, 70, 80];
        
        // Table headers
        doc.fontSize(10).font('Helvetica-Bold');
        doc.text('Date Acquired', tableLeft, tableTop);
        doc.text('Date Sold', tableLeft + colWidths[0], tableTop);
        doc.text('Asset', tableLeft + colWidths[0] + colWidths[1], tableTop);
        doc.text('Proceeds', tableLeft + colWidths[0] + colWidths[1] + colWidths[2], tableTop);
        doc.text('Cost Basis', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], tableTop);
        doc.text('Gain/Loss', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], tableTop);
        
        // Add line after headers
        doc.moveTo(tableLeft, tableTop + 15)
           .lineTo(tableLeft + colWidths.reduce((a, b) => a + b, 0), tableTop + 15)
           .stroke();
        
        // Table rows
        let rowTop = tableTop + 20;
        doc.fontSize(9).font('Helvetica');
        
        // Only show first 20 records to avoid huge PDFs
        const gains = taxReport.transactions.gains.slice(0, 20);
        
        gains.forEach((gain, index) => {
          // Check if we need a new page
          if (rowTop > 750) {
            doc.addPage();
            rowTop = 50;
          }
          
          doc.text(this.formatDate(gain.acquiredAt), tableLeft, rowTop);
          doc.text(this.formatDate(gain.timestamp), tableLeft + colWidths[0], rowTop);
          doc.text(gain.asset, tableLeft + colWidths[0] + colWidths[1], rowTop);
          doc.text(`$${gain.soldValue.toFixed(2)}`, tableLeft + colWidths[0] + colWidths[1] + colWidths[2], rowTop);
          doc.text(`$${gain.costBasis.toFixed(2)}`, tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], rowTop);
          doc.text(`$${gain.gainLoss.toFixed(2)}`, tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], rowTop);
          
          rowTop += 15;
          
          // Add a light line between rows
          if (index < gains.length - 1) {
            doc.moveTo(tableLeft, rowTop - 5)
               .lineTo(tableLeft + colWidths.reduce((a, b) => a + b, 0), rowTop - 5)
               .opacity(0.2)
               .stroke()
               .opacity(1);
          }
        });
        
        // Show indication if records were truncated
        if (taxReport.transactions.gains.length > 20) {
          doc.moveDown(1);
          doc.fontSize(10).font('Helvetica-Oblique')
            .text(`Showing 20 of ${taxReport.transactions.gains.length} records. Export to CSV for complete data.`, { align: 'center' });
        }
        
        // Add footer
        doc.moveDown(2);
        const currentDate = new Date();
        doc.fontSize(8).font('Helvetica')
          .text(`Generated on ${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`, { align: 'center' });
        doc.text('TaxSeason - Cryptocurrency Tax Reporting Tool', { align: 'center' });
        
        // End the document
        doc.end();
      } catch (error) {
        console.error('Error generating PDF:', error);
        reject(error);
      }
    });
  }
  
  /**
   * Format date for display
   */
  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

export default new ExportService(); 