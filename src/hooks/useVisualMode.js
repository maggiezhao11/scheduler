import {useState} from 'react';

export  function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
 
    function transition(newMode, replace = false) {

      if (replace) {
        const copiedHistory = [...history]
        copiedHistory.pop()
        setMode(newMode);
        setHistory([...copiedHistory, newMode])

      } else {
        setMode(newMode);
        setHistory([...history, newMode])
      }
    }

    function back() {
      if(history.length > 1) {
        const copiedHistory = [...history]
        setMode(history[history.length - 2])
        copiedHistory.pop()
        setHistory(copiedHistory)
      }
    }  


  return { mode, transition, back };
}

