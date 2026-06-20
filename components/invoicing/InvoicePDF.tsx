import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

import type { InvoiceSnapshot } from '@/types/database';

const brand = {
  dark: '#3d3126',
  mid: '#8a7f6e',
  light: '#f5ede3',
  cream: '#fdf9f4',
  border: '#d4c9b8',
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: brand.dark,
    backgroundColor: brand.cream,
    padding: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: brand.border,
  },
  companyName: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: brand.dark,
    letterSpacing: 0.5,
  },
  companyTagline: {
    fontSize: 9,
    color: brand.mid,
    marginTop: 2,
  },
  invoiceLabel: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: brand.dark,
    letterSpacing: 1,
    textAlign: 'right',
  },
  invoiceNumber: {
    fontSize: 10,
    color: brand.mid,
    textAlign: 'right',
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  billToLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: brand.mid,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  clientName: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: brand.dark,
    marginBottom: 3,
  },
  clientDetail: {
    fontSize: 9,
    color: brand.mid,
    marginBottom: 2,
  },
  dateBlock: {
    alignItems: 'flex-end',
  },
  dateLabel: {
    fontSize: 8,
    color: brand.mid,
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  dateValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: brand.dark,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: brand.dark,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 0,
  },
  tableHeaderText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    color: brand.light,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: brand.border,
  },
  tableRowAlt: {
    backgroundColor: brand.light,
  },
  colDesc: { flex: 4 },
  colQty: { flex: 1, textAlign: 'right' },
  colRate: { flex: 1.5, textAlign: 'right' },
  colAmount: { flex: 1.5, textAlign: 'right' },
  cellText: {
    fontSize: 9,
    color: brand.dark,
  },
  totalsBlock: {
    alignSelf: 'flex-end',
    width: 220,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: brand.border,
    paddingTop: 12,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  totalsLabel: {
    fontSize: 9,
    color: brand.mid,
  },
  totalsValue: {
    fontSize: 9,
    color: brand.dark,
    fontFamily: 'Helvetica-Bold',
  },
  totalFinalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: brand.dark,
  },
  totalFinalLabel: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: brand.dark,
  },
  totalFinalValue: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: brand.dark,
  },
  notesBlock: {
    marginTop: 32,
    padding: 14,
    borderWidth: 1,
    borderColor: brand.border,
    backgroundColor: brand.light,
  },
  notesLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: brand.mid,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  notesText: {
    fontSize: 9,
    color: brand.dark,
    lineHeight: 1.6,
  },
  footer: {
    position: 'absolute',
    bottom: 32,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderTopColor: brand.border,
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: brand.mid,
  },
});

function fmt(n: number) {
  return `$${n.toFixed(2)}`;
}

function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function InvoicePDF({ snapshot }: { snapshot: InvoiceSnapshot }) {
  const { invoice_number, issue_date, line_items, subtotal, tax_rate, tax_amount, total, notes, client } =
    snapshot;

  const taxPct = tax_rate ? (tax_rate * 100).toFixed(0) : '0';

  return (
    <Document>
      <Page size='LETTER' style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>Don's Fences & Services</Text>
            <Link src='https://maps.google.com/?q=67+Enderby+Mabel+Lk+Rd+Enderby+BC+V0E+1V4'>
              <Text style={styles.companyTagline}>67 Enderby Mabel Lk Rd, Enderby, BC V0E 1V4</Text>
            </Link>
            <Link src='https://donsfences.ca'>
              <Text style={styles.companyTagline}>donsfences.ca</Text>
            </Link>
          </View>
          <View>
            <Text style={styles.invoiceLabel}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>{invoice_number}</Text>
          </View>
        </View>

        {/* Bill to + Date */}
        <View style={styles.metaRow}>
          <View>
            <Text style={styles.billToLabel}>Bill To</Text>
            <Text style={styles.clientName}>{client.name}</Text>
            {client.address && (
              <Text style={styles.clientDetail}>{client.address}</Text>
            )}
            <Text style={styles.clientDetail}>{client.email}</Text>
            {client.phone && (
              <Text style={styles.clientDetail}>{client.phone}</Text>
            )}
          </View>
          <View style={styles.dateBlock}>
            <Text style={styles.dateLabel}>Issue Date</Text>
            <Text style={styles.dateValue}>{fmtDate(issue_date)}</Text>
          </View>
        </View>

        {/* Line items table */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.colDesc]}>Description</Text>
          <Text style={[styles.tableHeaderText, styles.colQty]}>Qty</Text>
          <Text style={[styles.tableHeaderText, styles.colRate]}>Rate</Text>
          <Text style={[styles.tableHeaderText, styles.colAmount]}>Amount</Text>
        </View>
        {line_items.map((item, i) => (
          <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
            <Text style={[styles.cellText, styles.colDesc]}>{item.description}</Text>
            <Text style={[styles.cellText, styles.colQty]}>{item.quantity}</Text>
            <Text style={[styles.cellText, styles.colRate]}>{fmt(item.rate)}</Text>
            <Text style={[styles.cellText, styles.colAmount]}>{fmt(item.amount)}</Text>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.totalsBlock}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Subtotal</Text>
            <Text style={styles.totalsValue}>{fmt(subtotal)}</Text>
          </View>
          {tax_rate != null && tax_rate > 0 && (
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Tax ({taxPct}%)</Text>
              <Text style={styles.totalsValue}>{fmt(tax_amount)}</Text>
            </View>
          )}
          <View style={styles.totalFinalRow}>
            <Text style={styles.totalFinalLabel}>Total Due</Text>
            <Text style={styles.totalFinalValue}>{fmt(total)}</Text>
          </View>
        </View>

        {/* Notes */}
        {notes && (
          <View style={styles.notesBlock}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don's Fences & Services · </Text>
          <Link src='https://maps.google.com/?q=67+Enderby+Mabel+Lk+Rd+Enderby+BC+V0E+1V4'>
            <Text style={styles.footerText}>67 Enderby Mabel Lk Rd, Enderby, BC V0E 1V4</Text>
          </Link>
          <Text style={styles.footerText}> · </Text>
          <Link src='https://donsfences.ca'>
            <Text style={styles.footerText}>donsfences.ca</Text>
          </Link>
          <Text style={styles.footerText}> · Thank you for your business</Text>
        </View>
      </Page>
    </Document>
  );
}
