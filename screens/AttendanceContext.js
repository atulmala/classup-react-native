import React, { useState, createContext } from "react";

export const AttendanceContext = createContext([{}, function(){}]);

export const AttendanceContextProvider = props => {
  const [present, setPresent] = useState(0);

  return (
    <AttendanceContext.Provider value={[present, setPresent]}>
      { props.children }
    </AttendanceContext.Provider>
  );
};