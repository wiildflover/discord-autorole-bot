/**
 * File: ticketStorage.js
 * Author: Wildflover
 * Description: Persistent storage system for ticket data using JSON database
 * Language: JavaScript (Node.js)
 */

const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

class TicketStorage {
  constructor() {
    this.dataPath = path.join(__dirname, '../../data/tickets.json');
    this.tickets = new Map();
    this.initialized = false;
  }

  async initialize() {
    try {
      const dataDir = path.dirname(this.dataPath);
      
      try {
        await fs.access(dataDir);
      } catch {
        await fs.mkdir(dataDir, { recursive: true });
        logger.info('TICKET-STORAGE', 'Created data directory');
      }

      try {
        const data = await fs.readFile(this.dataPath, 'utf8');
        const parsed = JSON.parse(data);
        this.tickets = new Map(Object.entries(parsed));
        logger.success('TICKET-STORAGE', `Loaded ${this.tickets.size} tickets from database`);
      } catch (error) {
        if (error.code === 'ENOENT') {
          await this.save();
          logger.info('TICKET-STORAGE', 'Created new ticket database');
        } else {
          throw error;
        }
      }

      this.initialized = true;
    } catch (error) {
      logger.error('TICKET-STORAGE', `Initialization failed: ${error.message}`);
      throw error;
    }
  }

  async save() {
    try {
      const data = Object.fromEntries(this.tickets);
      await fs.writeFile(this.dataPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      logger.error('TICKET-STORAGE', `Save failed: ${error.message}`);
      throw error;
    }
  }

  async createTicket(ticketData) {
    const ticket = {
      id: ticketData.channelId,
      userId: ticketData.userId,
      username: ticketData.username,
      category: ticketData.category,
      reason: ticketData.reason,
      status: 'open',
      createdAt: Date.now(),
      lastActivity: Date.now(),
      messages: [],
      closedAt: null,
      closedBy: null
    };

    this.tickets.set(ticket.id, ticket);
    await this.save();
    logger.success('TICKET-STORAGE', `Created ticket ${ticket.id} for ${ticket.username}`);
    return ticket;
  }

  async getTicket(channelId) {
    return this.tickets.get(channelId);
  }

  async updateTicket(channelId, updates) {
    const ticket = this.tickets.get(channelId);
    if (!ticket) return null;

    Object.assign(ticket, updates, { lastActivity: Date.now() });
    await this.save();
    return ticket;
  }

  async closeTicket(channelId, closedBy) {
    const ticket = this.tickets.get(channelId);
    if (!ticket) return null;

    ticket.status = 'closed';
    ticket.closedAt = Date.now();
    ticket.closedBy = closedBy;
    await this.save();
    logger.info('TICKET-STORAGE', `Closed ticket ${channelId}`);
    return ticket;
  }

  async deleteTicket(channelId) {
    const deleted = this.tickets.delete(channelId);
    if (deleted) {
      await this.save();
      logger.info('TICKET-STORAGE', `Deleted ticket ${channelId}`);
    }
    return deleted;
  }

  async getUserTickets(userId) {
    return Array.from(this.tickets.values()).filter(
      ticket => ticket.userId === userId && ticket.status === 'open'
    );
  }

  async getAllTickets(status = null) {
    const allTickets = Array.from(this.tickets.values());
    if (status) {
      return allTickets.filter(ticket => ticket.status === status);
    }
    return allTickets;
  }

  async getTicketStats() {
    const allTickets = Array.from(this.tickets.values());
    return {
      total: allTickets.length,
      open: allTickets.filter(t => t.status === 'open').length,
      pending: allTickets.filter(t => t.status === 'pending').length,
      closed: allTickets.filter(t => t.status === 'closed').length
    };
  }
}

module.exports = new TicketStorage();
