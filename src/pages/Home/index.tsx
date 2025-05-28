import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { differenceInSeconds } from 'date-fns';

import { HandPalm, Play } from "phosphor-react";
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  StopCountdownButton,
  TaskInput,
} from "./styles";

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
}

const mensagemErroMinutesAmountMinimo: string =
  "O ciclo precisa ser de no minimo 5 minutois";
const mensagemErroMinutesAmountMaximo: string =
  "O ciclo precisa ser de no maximo 60 minutois";
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "Informe a tarefa"),
  minutesAmount: zod
    .number()
    .min(5, mensagemErroMinutesAmountMinimo)
    .max(60, mensagemErroMinutesAmountMaximo),
});

export function Home() {
  //Variaveis
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecondsPased, setAmountSecondsPased] = useState<number>(0);

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  const task: string = watch("task");
  const isSubmitDisabled: boolean = !task;

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const totalSeconds: number = activeCycle ? activeCycle.minutesAmount * 60 : 0;
  const currentSeconds: number = activeCycle
    ? totalSeconds - amountSecondsPased
    : 0;

  const minutesAmount: number = Math.floor(currentSeconds / 60);
  const secondsAmount: number = currentSeconds % 60;

  const minutes: string = String(minutesAmount).padStart(2, "0");
  const seconds: string = String(secondsAmount).padStart(2, "0");

  //Lógica e funções

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        setAmountSecondsPased(differenceInSeconds(new Date(), activeCycle.startDate));
      }, 1000)
    }

    return () => {
      // O retorno de um useEffect serve para limpar o efeito anterior gerado na renderização passada. Quase um onDestroy 
      clearInterval(interval);
    }

  }, [activeCycle]);

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`;
    }
  }, [minutes, seconds, activeCycle]);

  function handleCreateNewCycle(data: NewCycleFormData): void {
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id: id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    // Fornece versao atualizada ja nesse ciclo da funcao;
    setCycles((currentState) => [...currentState, newCycle]);
    setActiveCycleId(id);
    setAmountSecondsPased(0);

    reset();
  }

  function handleInterruptCycle(): void {
    setCycles(cycles.map((cycle) => {
      if (cycle.id === activeCycleId) {
        return { ...cycle, interruptedDate: new Date() }
      } else {
        return cycle;
      }
    }));

    setActiveCycleId(null);
  }

  //JSX

  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            type="text"
            list="task-suggestions"
            placeholder="Dê um nome para o seu projeto"
            disabled={!!activeCycle} //!! converte o valor pra boolean
            {...register("task")}
          />

          <datalist id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
          </datalist>

          <label htmlFor="">durante</label>
          <MinutesAmountInput
            id="minutesAmount"
            type="number"
            placeholder="00"
            disabled={!!activeCycle}
            step={5}
            min={5}
            max={60}
            {...register("minutesAmount", { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        {activeCycle ? (
          <StopCountdownButton type="button" onClick={handleInterruptCycle}>
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}

      </form>
    </HomeContainer>
  );
}
