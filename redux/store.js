import { createStore } from 'redux';
import attendanceReducer from './reducer';

const store = createStore(attendanceReducer);

export default store;