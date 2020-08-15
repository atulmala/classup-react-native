export const MARK_ABSENCE = 'MARK_ABSENCE';
export const MARK_PRESENCE = 'MARK_PRESENCE';

let presentCount = 0;
let absentCount = 0;
const initialState = [];

export function initilizeCount(present) {
  presentCount = present;
}

export function markPresence() {
  return {
    type: MARK_PRESENCE,
    present: presentCount++,
    absent: absentCount--
  };
}


export function markAbsence() {
  return {
    type: MARK_ABSENCE,
    present: presentCount--,
    absent: absentCount++
  };

}

function attendanceReducer(state=initialState, action)  {
  switch (action.type)  {
    case MARK_ABSENCE:
      return [
        ...state,
        {
          
        }
      ]
  }
}
