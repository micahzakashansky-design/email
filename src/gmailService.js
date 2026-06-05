const { google } = require('googleapis');
const Store = require('electron-store');

const store = new Store();
const REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.modify'];

class GmailService {
  constructor() {
    this.oAuth2Client = null;
    this.init();
  }

  init() {
    const clientId = store.get('GMAIL_CLIENT_ID');
    const clientSecret = store.get('GMAIL_CLIENT_SECRET');

    if (clientId && clientSecret) {
      this.oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI);
      const token = store.get('GMAIL_TOKEN');
      if (token) {
        this.oAuth2Client.setCredentials(token);
      }
    }
  }

  getAuthUrl() {
    if (!this.oAuth2Client) {
      this.init(); // Try to re-init in case credentials were just set
    }
    if (!this.oAuth2Client) return null;

    return this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
  }

  async setToken(code) {
    if (!this.oAuth2Client) this.init();
    const { tokens } = await this.oAuth2Client.getToken(code);
    this.oAuth2Client.setCredentials(tokens);
    store.set('GMAIL_TOKEN', tokens);
    return tokens;
  }

  async listMessages() {
    if (!this.oAuth2Client) this.init();
    if (!this.oAuth2Client) throw new Error('Not authenticated');

    const gmail = google.gmail({ version: 'v1', auth: this.oAuth2Client });
    const res = await gmail.users.messages.list({ userId: 'me', maxResults: 20 });
    return res.data.messages || [];
  }

  async getMessage(id) {
    const gmail = google.gmail({ version: 'v1', auth: this.oAuth2Client });
    const res = await gmail.users.messages.get({ userId: 'me', id });
    return res.data;
  }

  formatMessage(msg) {
    const headers = msg.payload.headers;
    const subject = headers.find(h => h.name === 'Subject')?.value || '(No Subject)';
    const from = headers.find(h => h.name === 'From')?.value || '(Unknown Sender)';
    const date = headers.find(h => h.name === 'Date')?.value || new Date().toISOString();

    let body = '';
    if (msg.snippet) body = msg.snippet;

    return {
      id: msg.id,
      from,
      subject,
      body,
      date: new Date(date).toISOString(),
      isImportant: msg.labelIds.includes('IMPORTANT'),
      status: 'inbox',
      dueDate: null,
      gmailId: msg.id
    };
  }
}

module.exports = new GmailService();
