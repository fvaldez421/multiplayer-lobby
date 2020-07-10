import BaseController from "./BaseController";


class UserController extends BaseController {
  constructor(service) {
    super(service);
  }
}

export default new UserController();