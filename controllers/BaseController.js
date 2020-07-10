

class BaseController {
  constructor(service) {
    this.service = service;
    this.find = this.find.bind(this);
    this.findById = this.findById.bind(this);
    this.insert = this.insert.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async find({ query = {} }, res) {
    const result = await this.service.find(query);
    res.status(200).json(result);
  }

  async findById({ params = {} }, res) {
    const result = await this.service.find(params);
    const { data: [entity = null] = [], ...parsedResult } = result;
    parsedResult.data = entity;
    res.status(200).json(parsedResult);
  }

  async insert({ body }, res) {
    const result = await this.service.insert(body);
    res.status(result.statusCode).json(result);
  }

  async update({ params = {}, body }, res) {
    const result = await this.service.update(params, body);
    res.status(result.statusCode).json(result);
  }

  async delete({ params = {} }, res) {
    const result = await this.service.delete(params);
    res.status(result.statusCode).json(result);
  }
}


export default BaseController;