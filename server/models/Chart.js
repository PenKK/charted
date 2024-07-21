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
    items: {
      type: DataTypes.JSON,
      defaultValue: [],
      allowNull: false,
    },
  });

  Chart.associate = models => {
    Chart.belongsTo(models.Workspace, { as: "workspace", foreignKey: { name: "workspaceID", allowNull: false } });
    Chart.belongsTo(models.User, { as: "user", foreignKey: { name: "userID", allowNull: false } });
  };

  return Chart;
};
