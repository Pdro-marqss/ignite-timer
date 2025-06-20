import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { CyclesContext } from "../../contexts/CyclesContext";

import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";

import { HandPalm, Play } from "phosphor-react";
import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles";

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

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;


export function Home() {
  const { activeCycle, createNewCycle, interruptCurrentCycle } = useContext(CyclesContext);

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  const { handleSubmit, watch, reset } = newCycleForm;

  const task: string = watch("task");
  const isSubmitDisabled: boolean = !task;

  function handleCreateNewCycle(data: NewCycleFormData): void {
    createNewCycle(data);
    reset();
  }

  //JSX
  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        {activeCycle ? (
          <StopCountdownButton type="button" onClick={interruptCurrentCycle}>
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
