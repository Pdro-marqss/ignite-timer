import { useEffect, useContext } from "react";
import { differenceInSeconds } from "date-fns";
import { CountdownContainer, Separator } from "./styles";
import { CyclesContext } from "../../../../contexts/CyclesContext";

export function Countdown() {
  const { activeCycle, activeCycleId, amountSecondsPassed, markCurrentCycleAsFinished, setSecondsPassed } = useContext(CyclesContext);

  const totalSeconds: number = activeCycle ? activeCycle.minutesAmount * 60 : 0;
  const currentSeconds: number = activeCycle
    ? totalSeconds - amountSecondsPassed
    : 0;

  const minutesAmount: number = Math.floor(currentSeconds / 60);
  const secondsAmount: number = currentSeconds % 60;

  const minutes: string = String(minutesAmount).padStart(2, "0");
  const seconds: string = String(secondsAmount).padStart(2, "0");

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference: number = differenceInSeconds(new Date(), activeCycle.startDate);

        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished();
          setSecondsPassed(totalSeconds)
          clearInterval(interval);
        } else {
          setSecondsPassed(secondsDifference);
        }
      }, 1000)
    }

    return () => {
      // O retorno de um useEffect serve para limpar o efeito anterior gerado na renderização passada. Quase um onDestroy 
      clearInterval(interval);
    }

  }, [activeCycle, totalSeconds, activeCycleId, markCurrentCycleAsFinished, setSecondsPassed]);

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`;
    }
  }, [minutes, seconds, activeCycle]);

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>

      <Separator>:</Separator>

      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  );
}