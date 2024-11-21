import ActivityLog from "../model/ActivityLogs.js";

const getActivityLogs = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const skip = (page - 1) * limit;
    const activityLogs = await ActivityLog.find()
      .sort({ createdAt: -1 }) // Sort by latest first
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    const totalLogs = await ActivityLog.countDocuments();
    const totalPages = Math.ceil(totalLogs / limit);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        logs: activityLogs,
        pagination: {
          total: totalLogs,
          totalPages,
          currentPage: parseInt(page),
        },
      },
      message:
        activityLogs.length > 0
          ? "Activity logs retrieved successfully"
          : "No activity logs found",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Server error while retrieving activity logs",
      error: error.message,
    });
  }
};

const createActivityLog = async (req, res) => {
  const activityLog = req.body;
  const newActivityLog = new ActivityLog({
    ...activityLog,
  });
  try {
    await newActivityLog.save();
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Activity log created successfully",
      data: newActivityLog,
    });
  } catch (error) {
    res.status(409).json({
      success: false,
      statusCode: 409,
      message: error.message,
    });
  }
};

const deleteActivityLog = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedLog = await ActivityLog.findByIdAndDelete(id);
    if (!deletedLog) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Activity log not found",
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Activity log deleted successfully",
      data: deletedLog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Server error while deleting activity log",
      error: error.message,
    });
  }
};

export { getActivityLogs, createActivityLog, deleteActivityLog };
