export const INITIALIZE_PRESENT = 'INITIALIZE_PRESENT';
export const INITIALZE_ABSENT = 'INITIALIZE_ABSENT';
export const MARK_PRESENCE = 'MARK_PRESENCE';
export const MARK_ABSENCE = 'MARK_ABSENCE';

var presentCount = 0;
var absentCount = 0;

export function initializePresent(count) {
  console.log('initializePresent called!');
  presentCount = count;
  return {
    type: INITIALIZE_PRESENT,
    present: count,

  };
}

export function initializeAbsent(count) {
  console.log('initializeAbsent called!');
  absentCount = count;
  return {
    type: INITIALIZE_ABSENT,
    absent: count,
  };
}

export function markPresent() {
  console.log('markPresent called!');
  return {
    type: MARK_PRESENCE,
    present: presentCount++,
    absent: absentCount--
  };
}

export function markAbsent() {
  console.log('markAbsent called!');
  return {
    type: MARK_ABSENCE,
    present: presentCount--,
    absent: absentCount++
  };
}

const initialState = [];

function attendanceReducer(state = initialState, action) {
  switch (action.type) {
    case INITIALIZE_PRESENT:
    case INITIALZE_ABSENT:
    case MARK_ABSENCE:
    case MARK_PRESENCE:
      console.log("state = ", state);
      return[
        ...state,
        {}
        
      ];

    default:
      return state;
  }
}

export default attendanceReducer;