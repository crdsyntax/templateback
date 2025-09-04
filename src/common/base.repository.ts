import { Model, Types } from 'mongoose';

export class BaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    const created = new this.model(data);
    return (await created.save()) as T;
  }

  async findAll(): Promise<T[]> {
    return this.model.find().exec() as Promise<T[]>;
  }

  async findById(id: string): Promise<T | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.model.findById(id).exec() as Promise<T | null>;
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.model
      .findByIdAndUpdate(id, data, { new: true })
      .exec() as Promise<T | null>;
  }

  async delete(id: string): Promise<T | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.model.findByIdAndDelete(id).exec() as Promise<T | null>;
  }
}
