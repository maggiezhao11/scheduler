import {useState} from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
 
    function transition(newMode, replace = false) {

      if (replace) {
        const copiedHistory = [...history]
        copiedHistory.pop()
        setMode(newMode);
        setHistory(prev => ([...prev, mode]))

      } else {
        setMode(newMode);
        setHistory(prev => ([...prev, mode]))
      }
    }

    function back() {
      if(history.length > 1) {
        const copiedHistory = [...history]
        setMode(history[history.length - 2])
        copiedHistory.pop()
        setHistory(prev => ([...prev, mode]))
      }
    }  


  return { mode, transition, back };
}

