const AdminDashService = require('../services/AdminDash.service');

//------------Get all dashboard data----------------
exports.AdminGetAllUsers = async (req, res) => {
  try {
    const users = await AdminDashService.GetAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//------------Get specific User by search----------------
exports.AdminGetUserBySearch = async (req, res) => {
  try {
    const { search } = req.query;
    const user = await AdminDashService.AdminGetUserBySearch(search);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//------------Get user paginated----------------
exports.AdminGetUsersPaginated = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;

    const data = await AdminDashService.AdminGetUsersPaginated(
      parseInt(page),
      parseInt(limit)
    );

    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//------------Get user paginated backward----------------
exports.AdminGetUsersPaginatedBackward = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const data = await AdminDashService.AdminGetUsersPaginatedBackward(
      parseInt(page),
      parseInt(limit)
    );
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//------------Get all User----------------
exports.AdminGetAllUsersdata = async (req, res) => {
  try {
    const users = await AdminDashService.AdminGetAllUsersdata();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//------------Get all deposit User----------------
exports.AdminGetAllDepositUsers = async (req, res) => {
  try {
    const users = await AdminDashService.AdminGetAllDepositUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//------------Handle Deposit Confirmed----------------
// Controller
exports.AdminHandleDepositConfirmed = async (req, res) => {
  try {
    const { _id } = req.body;
    console.log(`Handling deposit confirmation for deposit ID: ${_id}`);

    // Call service (fast response)
    const result = await AdminDashService.AdminHandleDepositConfirmed(_id);

    // Send success response immediately
    res.status(200).json({
      success: true,
      message: "Deposit confirmed successfully",
      data: result,
    });

  } catch (err) {
    console.error("Error confirming deposit:", err);
    res.status(400).json({
      success: false,
      message: err.message || "Error confirming deposit",
    });
  }
};

//------------Handle Deposit Declined----------------
exports.AdminHandleDepositDeclined = async (req, res) => {
  try {
    const {_id, comment} = req.body;
    const users = await AdminDashService.AdminHandleDepositDeclined(_id, comment);
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//------------Get all withdraw User----------------
exports.AdminGetAllWithdrawUsers = async (req, res) => {
  try {
    const users = await AdminDashService.AdminGetAllWithdrawUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};  

//------------Handle Withdraw Confirmed----------------
exports.AdminHandleWithdrawConfirmeds = async (req, res) => {
  try {
    const {_id} = req.body;
    const users = await AdminDashService.AdminHandleWithdrawConfirmed(_id);
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
//------------Handle withdraw Declined----------------
exports.AdminHandleWithdrawDeclineds = async (req, res) => {
  try {
    const {_id, comment} = req.body;
    const users = await AdminDashService.AdminHandleWithdrawDeclined(_id, comment);
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//-------------GET Specific User data---------------------
exports.adminGetSpecificUsers = async (req, res) => {
  try {
    const _id = req.params.id;
    const users = await AdminDashService.adminGetSpecificUsers(_id);
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//------------Handle Contact Us----------------
exports.admincontactUs = async (req, res) => {
  try {
    const users = await AdminDashService.admincontactUs();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//------------delete user----------------
exports.adminDeleteUser = async (req, res) => {
  try {
    const {_id} = req.body;
    console.log(`Deleting user with ID: ${_id}`);
    const users = await AdminDashService.adminDeleteUser(_id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//------------Get Rizydra Info----------------
exports.adminGetRizydraInfo = async (req, res) => {
  try {
    const rizydraInfo = await AdminDashService.adminGetRizydraInfo();
    res.status(200).json({ status: true, data: rizydraInfo });
  } catch (err) {
    res.status(400).json({ status: false, error: err.message });
  }
};

//------------update Rizydra Info----------------
exports.adminUpdateRizydraInfo = async (req, res) => {
  try {
    const { dailyPercentage } = req.body;
    await AdminDashService.adminUpdateRizydraInfo({ dailyPercentage });
    res.status(200).json({status: true, message: "Rizydra info updated successfully"});
  } catch (err) {
    res.status(400).json({status: false, error: err.message});
  }
};


