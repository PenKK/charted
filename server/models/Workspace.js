module.exports = (sequelize, DataTypes) => {
  const Workspace = sequelize.define("Workspace", {
    workspaceID: {
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
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });

  Workspace.associate = models => {
    Workspace.belongsTo(models.User, { as: "user", foreignKey: { name: "userID", allowNull: false } });
    Workspace.hasMany(models.Chart, { as: "charts", foreignKey: { name: "workspaceID", allowNull: false } });
  };

  return Workspace;
};
