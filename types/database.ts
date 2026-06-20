export interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  created_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string;
  status: 'draft' | 'sent';
  issue_date: string;
  line_items: LineItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  sent_at: string | null;
}

export interface InvoiceEmailLog {
  id: string;
  invoice_id: string;
  sent_at: string;
  resend_message_id: string | null;
  recipient_email: string;
  snapshot: {
    line_items: LineItem[];
    subtotal: number;
    tax_rate: number;
    tax_amount: number;
    total: number;
  };
  pdf_path: string | null;
  status: string;
}

export interface InvoiceWithClient extends Invoice {
  clients: Client;
}

export interface InvoiceSnapshot {
  invoice_number: string;
  issue_date: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes: string | null;
  line_items: LineItem[];
  client: {
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
  };
}
