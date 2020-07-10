// import and use route helpers here
import { UserController } from '../../controllers';

const routes = router => {
  router.route('/users')
    .get(UserController.find)
    .post(UserController.insert);
  router.route('/users/:_id')
    .get(UserController.findById)
    .put(UserController.update)
    .delete(UserController.delete);
  return router;
}

export default routes;