// import and use route helpers here
import { LobbyController } from '../../controllers';

const routes = router => {
  router.route('/lobbies')
    .get(LobbyController.find)
    .post(LobbyController.insert);
  router.route('/lobbies/:_id')
    .get(LobbyController.findById)
    .put(LobbyController.update)
    .delete(LobbyController.delete);
  return router;
}

export default routes;