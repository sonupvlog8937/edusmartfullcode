const AdmissionEnquiry = require("../model/admissionEnquiry.model");

const statusOptions = AdmissionEnquiry.schema.path("status")?.enumValues || [];
const sourceOptions = AdmissionEnquiry.schema.path("source")?.enumValues || [];

const toDateOrNull = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

exports.createAdmissionEnquiry = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const payload = {
      ...req.body,
      school: schoolId,
      source: req.body.source || sourceOptions[0],
      status: req.body.status || statusOptions[0],
      followUpDate: toDateOrNull(req.body.followUpDate),
    };

    const enquiry = await AdmissionEnquiry.create(payload);
    return res.status(201).json({ message: "Admission enquiry created.", enquiry });
  } catch (error) {
    console.error("createAdmissionEnquiry error:", error);
    return res.status(500).json({ message: "Unable to create admission enquiry." });
  }
};

exports.fetchAdmissionEnquiries = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const {
      q = "",
      status = "all",
      source = "all",
      classInterested = "all",
      page = 1,
      limit = 10,
    } = req.query;

    const safePage = Math.max(parseInt(page, 10) || 1, 1);
    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

    const filter = { school: schoolId };
    if (status !== "all") filter.status = status;
    if (source !== "all") filter.source = source;
    if (classInterested !== "all") filter.classInterested = classInterested;

    if (q?.trim()) {
      filter.$or = [
        { studentName: { $regex: q.trim(), $options: "i" } },
        { guardianName: { $regex: q.trim(), $options: "i" } },
        { contactNumber: { $regex: q.trim(), $options: "i" } },
        { email: { $regex: q.trim(), $options: "i" } },
      ];
    }

    const [totalItems, items, classes, ...counts] = await Promise.all([
      AdmissionEnquiry.countDocuments(filter),
      AdmissionEnquiry.find(filter)
        .sort({ createdAt: -1 })
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit),
      AdmissionEnquiry.distinct("classInterested", { school: schoolId }),
      ...statusOptions.map((statusItem) => AdmissionEnquiry.countDocuments({ school: schoolId, status: statusItem })),
    ]);

    const stats = statusOptions.map((statusItem, index) => ({ _id: statusItem, count: counts[index] }));

    return res.json({
      items,
      stats,
      sourceOptions,
      statusOptions,
      classes,
      pagination: {
        page: safePage,
        limit: safeLimit,
        totalItems,
        totalPages: Math.max(Math.ceil(totalItems / safeLimit), 1),
      },
    });
  } catch (error) {
    console.error("fetchAdmissionEnquiries error:", error);
    return res.status(500).json({ message: "Unable to fetch admission enquiries." });
  }
};

exports.updateAdmissionEnquiry = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const { id } = req.params;

    const updated = await AdmissionEnquiry.findOneAndUpdate(
      { _id: id, school: schoolId },
      {
        ...req.body,
        followUpDate: toDateOrNull(req.body.followUpDate),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Enquiry not found." });
    }

    return res.json({ message: "Admission enquiry updated.", enquiry: updated });
  } catch (error) {
    console.error("updateAdmissionEnquiry error:", error);
    return res.status(500).json({ message: "Unable to update admission enquiry." });
  }
};

exports.deleteAdmissionEnquiry = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const { id } = req.params;

    const deleted = await AdmissionEnquiry.findOneAndDelete({ _id: id, school: schoolId });

    if (!deleted) {
      return res.status(404).json({ message: "Enquiry not found." });
    }

    return res.json({ message: "Admission enquiry deleted." });
  } catch (error) {
    console.error("deleteAdmissionEnquiry error:", error);
    return res.status(500).json({ message: "Unable to delete admission enquiry." });
  }
};
