import { Router } from 'express';
import { getMessagesBetweenUsers } from '../controllers/message.controller';
import { markMessagesAsRead } from '../controllers/message.controller';
import { createMessage } from '../controllers/message.controller';

const router = Router();

router.get('/:user1/:user2', getMessagesBetweenUsers);
router.put('/read', markMessagesAsRead);
router.post('/', createMessage);


export default router;
