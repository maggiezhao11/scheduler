import {useState} from 'react';

export default function useVisualMode(initial) {
  // const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
 
    function transition(newMode, replace = false) {

      if (replace) {
        // const copiedHistory = [...history]
        // copiedHistory.pop()
        // setMode(newMode);
        setHistory(prev => ([...prev.slice(0, history.length - 1), newMode]))

      } else {
        // setMode(newMode);
        setHistory(prev => ([...prev, newMode]))
      }
    }

    function back() {
      if(history.length < 2) {
        return 
      }
        // const copiedHistory = [...history]
        // setMode(history[history.length - 2])
        // copiedHistory.pop()
        setHistory(prev => ([...prev.slice(0, history.length - 1)]))
     
    }  


  return { mode: history[history.length - 1], transition, back };
}

