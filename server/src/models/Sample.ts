import { Model } from "sequelize";
import { Table } from 'sequelize-typescript'

export interface ISample {
  sample_id: string,
  protocol_type: string,
  event_type: string,
  sample_url: string
}

module.exports = (sequelize: any, DataTypes: any) => {
  @Table({ tableName: "samples" })
  class Sample extends Model<ISample> {
    sample_id: string;
    protocol_type: string;
    event_type: string;
    sample_url: string;

  }
  Sample.init({
    sample_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    protocol_type: DataTypes.STRING,
    event_type: DataTypes.STRING,
    sample_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Samples',
    timestamps: false
  })
  
  return Sample
}


