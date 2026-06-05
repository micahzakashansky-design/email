const { google } = require('googleapis');
const Store = require('electron-store');
const http = require('http');
const url = require('url');

const store = new Store();
const PORT = 42813; // Random high port for loopback
const REDIRECT_URI = `http://localhost:${PORT}`;

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

  async authenticate() {
    if (!this.oAuth2Client) this.init();
    if (!this.oAuth2Client) throw new Error('Provide Client ID and Secret first');

    return new Promise((resolve, reject) => {
      const server = http.createServer(async (req, res) => {
        try {
          if (req.url.indexOf('/?code=') > -1) {
            const qs = new url.URL(req.url, REDIRECT_URI).searchParams;
            const code = qs.get('code');
            res.end('Authentication successful! You can close this tab.');
            server.destroy();

            const { tokens } = await this.oAuth2Client.getToken(code);
            this.oAuth2Client.setCredentials(tokens);
            store.set('GMAIL_TOKEN', tokens);
            resolve(tokens);
          }
        } catch (e) {
          reject(e);
        }
      }).listen(PORT, () => {
        const authUrl = this.oAuth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: SCOPES,
        });
        require('electron').shell.openExternal(authUrl);
      });

      // Simple destroy helper
      server.destroy = () => {
        server.close();
      };
    });
  }

  async listMessages() {
    if (!this.oAuth2Client) this.init();
    if (!this.oAuth2Client || !this.oAuth2Client.credentials.access_token) {
        throw new Error('Not authenticated');
    }

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
