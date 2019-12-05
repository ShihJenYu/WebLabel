import { combineReducers } from "redux";
import tasks from './tasks';
import projects from './projects';
import packs from './packs';
import batchs from './batchs';
import videos from './videos';

export default combineReducers({
    tasks,
    projects,
    packs,
    batchs,
    videos
});