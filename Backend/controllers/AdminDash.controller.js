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
exports.AdminHandleDepositConfirmed = async (req, res) => {
  try {
    const {_id} = req.body;
    console.log(
        `Handling deposit confirmation for user ID: ${_id}`
    );
    
    const users = await AdminDashService.AdminHandleDepositConfirmed(_id);
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
