const TableService = require("../services/table.service");
const tableService = new TableService();

/* GET */
exports.getAllTables = async (req, res, next) => {
  try {
    const tables = await tableService.getAllTables();
    res.send(tables);
  } catch (error) {
    next(error);
  }
};

exports.getOneTable = async (req, res) => {
  try {
    const table = await tableService.getOneTable(req.params.id);
    res.send(table);
  } catch (error) {
    res.status(404).json({ message: "Table not found" });
  }
};

exports.addNewTable = async (req, res, next) => {
  try {
    const newTable = await tableService.addNewTable(req.body.seats_count);
    res.status(200).send(newTable.toJSON());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateSeatsCount = async (req, res, next) => {
  try {
    const updatedTable = await tableService.updateSeatsCount(
      req.params.id,
      req.body.seats_count,
    );
    res
      .status(200)
      .json({ message: "Table updated successfully.", table: updatedTable });
  } catch (error) {
    res
      .status(error.message === "Table not found." ? 404 : 400)
      .json({ message: error.message });
  }
};

exports.updateSeatedGuestsStatus = async (req, res, next) => {
  try {
    const updatedTable = await tableService.updateSeatedGuestsStatus(
      req.params.id,
      false,
      true,
    );
    res.status(200).json({
      message: "Table status updated successfully.",
      table: updatedTable,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.deleteTable = async (req, res, next) => {
  try {
    await tableService.deleteTable(req.params.id);
    res.status(200).json({ message: "Table deleted successfully." });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
