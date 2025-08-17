import { useState, useReducer, createContext, ReactNode } from "react";

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

interface CyclesContextType {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;

  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
  createNewCycle: (data: CreateCycleData) => void;
  interruptCurrentCycle: () => void;
}

interface CyclesContextProviderProps {
  children: ReactNode
}

interface CyclesState {
  cycles: Cycle[]
  activeCycleId: string | null
}

export const CyclesContext = createContext({} as CyclesContextType);

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer((state: CyclesState, action: any) => {
    if(action.type === "ADD_NEW_CYCLE") {
      return {
        ...state,
        cycles: [...state.cycles, action.payload.newCycle ],
        activeCycleId: action.payload.newCycle.id, 
      }
    }

    if(action.type === "INTERRUPT_CURRENT_CYCLE") {
      return {
        ...state,
        cycles: state.cycles.map(cycle => {
          if (cycle.id === state.activeCycleId) {
            return { ...cycle, interruptedDate: new Date() }
          } else {
            return cycle
          }
        }),
        activeCycleId: null
      }
    }
    
    return state;
  }, {cycles: [], activeCycleId: null});

  const [amountSecondsPassed, setAmountSecondsPassed] = useState<number>(0);
  
  const { cycles, activeCycleId} = cyclesState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function setSecondsPassed(seconds: number): void {
    setAmountSecondsPassed(seconds);
  }

  function markCurrentCycleAsFinished(): void {
    dispatch({
      type: "MARK_CURRENT_CYCLE_AS_FINISHED",
      payload: {
        activeCycleId,
      }
    })
    // setCycles((state) => state.map((cycle) => {
    //   if (cycle.id === activeCycleId) {
    //     return { ...cycle, finishedDate: new Date() }
    //   } else {
    //     return cycle;
    //   }
    // }),
    // );
  }

  function createNewCycle(data: CreateCycleData): void {
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id: id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    // Fornece versao atualizada ja nesse ciclo da funcao;
    dispatch({
      type: "ADD_NEW_CYCLE",
      payload: {
        newCycle,
      }
    })
    // setCycles((currentState) => [...currentState, newCycle]);
    setAmountSecondsPassed(0);
  }

  function interruptCurrentCycle(): void {
    dispatch({
      type: "INTERRUPT_CURRENT_CYCLE",
      payload: {
        activeCycleId,
      }
    })
    // setCycles((state) => state.map((cycle) => {
    //   if (cycle.id === activeCycleId) {
    //     return { ...cycle, interruptedDate: new Date() }
    //   } else {
    //     return cycle;
    //   }
    // }),
    // );
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        amountSecondsPassed,
        markCurrentCycleAsFinished,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle
      }}
    >{children}</CyclesContext.Provider>
  )
}