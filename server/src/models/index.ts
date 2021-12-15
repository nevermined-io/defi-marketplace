
import fs from 'fs'
import path from 'path'
import { Sequelize, DataTypes } from 'sequelize'
import config from '../config';

const basename = path.basename(__filename);
const db: any = {};

const sequelize = new Sequelize(
  config.db.database,
  config.db.userName,
  config.db.password,
  {
    host: config.db.host,
    dialect: 'mysql',
    "define": {
      "underscored": true
    }
  }
)

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.ts' || file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db
