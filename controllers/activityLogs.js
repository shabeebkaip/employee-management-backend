import ActivityLog from "../model/ActivityLogs.js";

const getActivityLogs = async (req, res) => {
  try {
    const activityLogs = await ActivityLog.find();
    if (activityLogs.length === 0) {
      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: [],
        message: "No activity logs found",
      });
      D;
    }
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: activityLogs,
      message: "Activity logs fetched successfully",
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
      success: false,
      statusCode: 404,
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

export { getActivityLogs, createActivityLog };
