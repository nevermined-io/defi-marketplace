import { Model } from "sequelize";
import { Table } from 'sequelize-typescript'

export interface IDataset {
  dataset_id: number,
  key: string,
  source: string,
  file_name: string
}

module.exports = (sequelize: any, DataTypes: any) => {
  @Table({ tableName: "datasets" })
  class Dataset extends Model<IDataset> {
    dataset_id: number;
    key: string;
    source: string;

    static associate(models: any) {
      Dataset.belongsToMany(models.Bundles, {
        through: 'dataset_bundles'
      })
    }
  }

  Dataset.init({
    dataset_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    key: DataTypes.STRING,
    source: DataTypes.STRING,
    file_name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Datasets',
    timestamps: false
  })

  return Dataset

}

