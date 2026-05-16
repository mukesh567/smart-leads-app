import { Request, Response, NextFunction } from 'express';
import Lead, { LeadStatus, LeadSource } from '../models/Lead';
import { createObjectCsvStringifier } from 'csv-writer';

// @desc    Get all leads with pagination, filtering, search, and sorting
// @route   GET /api/leads
// @access  Private
export const getLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const status = req.query.status;
    const source = req.query.source;
    const search = req.query.search as string;
    const sort = (req.query.sort as string) || 'latest';

    let query: any = {};

    if (status) query.status = status;
    if (source) query.source = source;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };

    const totalLeads = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.json({
      leads,
      page,
      pages: Math.ceil(totalLeads / limit),
      total: totalLeads,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
export const getLeadById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (lead) {
      res.json(lead);
    } else {
      res.status(404);
      throw new Error('Lead not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create lead
// @route   POST /api/leads
// @access  Private
export const createLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, status, source } = req.body;
    const lead = await Lead.create({ name, email, status, source });
    res.status(201).json(lead);
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
export const updateLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, status, source } = req.body;
    const lead = await Lead.findById(req.params.id);

    if (lead) {
      lead.name = name || lead.name;
      lead.email = email || lead.email;
      lead.status = status || lead.status;
      lead.source = source || lead.source;

      const updatedLead = await lead.save();
      res.json(updatedLead);
    } else {
      res.status(404);
      throw new Error('Lead not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private (Admin only logic can be added in routes)
export const deleteLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (lead) {
      await lead.deleteOne();
      res.json({ message: 'Lead removed' });
    } else {
      res.status(404);
      throw new Error('Lead not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Export leads to CSV
// @route   GET /api/leads/export
// @access  Private
export const exportLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const leads = await Lead.find({});
    
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'name', title: 'NAME' },
        { id: 'email', title: 'EMAIL' },
        { id: 'status', title: 'STATUS' },
        { id: 'source', title: 'SOURCE' },
        { id: 'createdAt', title: 'CREATED AT' },
      ],
    });

    const csvContent = 
      csvStringifier.getHeaderString() + 
      csvStringifier.stringifyRecords(leads);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};
