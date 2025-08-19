import { useState, useReducer, createContext, ReactNode } from "react";
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer";
import { addNewCycleAction, InterruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";

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

export const CyclesContext = createContext({} as CyclesContextType);

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(cyclesReducer, {
    cycles: [], 
    activeCycleId: null
  });

  const [amountSecondsPassed, setAmountSecondsPassed] = useState<number>(0);
  
  const { cycles, activeCycleId} = cyclesState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function setSecondsPassed(seconds: number): void {
    setAmountSecondsPassed(seconds);
  }

  function markCurrentCycleAsFinished(): void {
    dispatch(markCurrentCycleAsFinishedAction())
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
    dispatch(addNewCycleAction(newCycle));
    setAmountSecondsPassed(0);
  }

  function interruptCurrentCycle(): void {
    dispatch(InterruptCurrentCycleAction)
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