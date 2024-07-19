module.exports = (sequelize, DataTypes) => {
  const Chart = sequelize.define("Chart", {
    chartID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userID: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "userID",
      },
    },
  });

  Chart.associate = models => {
    Chart.belongsTo(models.Workspace, { as: "workspace", foreignKey: "workspaceID" });
  };

  return Chart;
};
