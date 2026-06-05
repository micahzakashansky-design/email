const { google } = require('googleapis');
const { ipcMain, shell } = require('electron');
const Store = require('electron-store');
const path = require('path');

const store = new Store();

// These would normally be provided via environment variables or a config file
const CLIENT_ID = store.get('GMAIL_CLIENT_ID');
const CLIENT_SECRET = store.get('GMAIL_CLIENT_SECRET');
const REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob'; // Or a custom protocol

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.modify'];

class GmailService {
  constructor() {
    this.oAuth2Client = null;
    if (CLIENT_ID && CLIENT_SECRET) {
      this.oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
      const token = store.get('GMAIL_TOKEN');
      if (token) {
        this.oAuth2Client.setCredentials(token);
      }
    }
  }

  getAuthUrl() {
    if (!this.oAuth2Client) return null;
    return this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
  }

  async setToken(code) {
    const { tokens } = await this.oAuth2Client.getToken(code);
    this.oAuth2Client.setCredentials(tokens);
    store.set('GMAIL_TOKEN', tokens);
    return tokens;
  }

  async listMessages() {
    const gmail = google.gmail({ version: 'v1', auth: this.oAuth2Client });
    const res = await gmail.users.messages.list({ userId: 'me', maxResults: 20 });
    return res.data.messages || [];
  }

  async getMessage(id) {
    const gmail = google.gmail({ version: 'v1', auth: this.oAuth2Client });
    const res = await gmail.users.messages.get({ userId: 'me', id });
    return res.data;
  }

  // Format Gmail message to our app's internal format
  formatMessage(msg) {
    const headers = msg.payload.headers;
    const subject = headers.find(h => h.name === 'Subject')?.value || '(No Subject)';
    const from = headers.find(h => h.name === 'From')?.value || '(Unknown Sender)';
    const date = headers.find(h => h.name === 'Date')?.value || new Date().toISOString();

    // Simplistic body extraction
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
