import { Model } from "sequelize";
import { Table } from 'sequelize-typescript'

export interface IBundle {
  bundle_id: string,
  user: string,
  did: string,
  status: string,
  price: number
}

module.exports = (sequelize: any, DataTypes: any) => {
  @Table({ tableName: "bundles" })
  class Bundle extends Model<IBundle> {
    bundle_id: string;
    user: string;
    did: string;
    status: string;
    price: number

    static associate(models: any) {
      Bundle.belongsToMany(models.Datasets, {
        through: 'dataset_bundles'
      })
    }

  }
  Bundle.init({
    bundle_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    user: DataTypes.STRING,
    did: DataTypes.STRING,
    status: DataTypes.STRING,
    price: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Bundles'
  })

  return Bundle
}


