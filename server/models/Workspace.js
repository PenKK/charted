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
    userID: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "userID",
      },
    },
  });

  Workspace.associate = models => {
    Workspace.belongsTo(models.User, { as: "user", foreignKey: "userID" });
  };

  return Workspace;
};
