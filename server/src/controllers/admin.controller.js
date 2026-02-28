const adminService = require("../services/admin.service");

// ─── PROVIDER ENDPOINTS ───

// POST /api/admin/providers
const createProvider = async (req, res, next) => {
  try {
    const { category_id, name, city } = req.body;
    if (!category_id || !name || !city) {
      return res
        .status(400)
        .json({ error: "category_id, name, and city are required" });
    }
    const provider = await adminService.createProvider(req.body);
    res
      .status(201)
      .json({ message: "Provider created (pending approval)", data: provider });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/providers/:id
const updateProvider = async (req, res, next) => {
  try {
    const provider = await adminService.updateProvider(req.params.id, req.body);
    res.json({ message: "Provider updated", data: provider });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/providers/:id
const deleteProvider = async (req, res, next) => {
  try {
    await adminService.deleteProvider(req.params.id);
    res.json({ message: "Provider deleted" });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/providers/:id/approve
const approveProvider = async (req, res, next) => {
  try {
    const provider = await adminService.setApproval(req.params.id, true);
    res.json({ message: "Provider approved", data: provider });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/providers/:id/reject
const rejectProvider = async (req, res, next) => {
  try {
    const provider = await adminService.setApproval(req.params.id, false);
    res.json({ message: "Provider rejected", data: provider });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/providers/pending
const getPending = async (req, res, next) => {
  try {
    const providers = await adminService.getPending();
    res.json({ data: providers });
  } catch (err) {
    next(err);
  }
};

// ─── SERVICE PRICING ENDPOINTS ───

// POST /api/admin/services
const addService = async (req, res, next) => {
  try {
    const { provider_id, service_name, price } = req.body;
    if (!provider_id || !service_name || !price) {
      return res
        .status(400)
        .json({ error: "provider_id, service_name, and price are required" });
    }
    const service = await adminService.addService(req.body);
    res.status(201).json({ message: "Service added", data: service });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/services/:id
const updateService = async (req, res, next) => {
  try {
    const service = await adminService.updateService(req.params.id, req.body);
    res.json({ message: "Service updated", data: service });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/services/:id
const deleteService = async (req, res, next) => {
  try {
    await adminService.deleteService(req.params.id);
    res.json({ message: "Service deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createProvider,
  updateProvider,
  deleteProvider,
  approveProvider,
  rejectProvider,
  getPending,
  addService,
  updateService,
  deleteService,
};
