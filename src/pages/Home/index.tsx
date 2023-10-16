import { useState, createContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';

import { HandPalm, Play } from 'phosphor-react';
import { HomeContainer, StartCountdownButton, StopCountdownButton } from './styles';

import { NewCycleForm } from './components/NewCycleForm';
import { Countdown } from './components/Countdown';

interface Cycle {
   id: string;
   task: string;
   minutesAmount: number;
   startDate: Date;
   interruptedDate?: Date;
   finishedDate?: Date;
}

interface CyclesContextType {
   activeCycle: Cycle | undefined;
   activeCycleId: string | null;
   amountSecondsPassed: number;
   markCurrentCycleAsFinished: () => void;
   setSecondsPassed: (seconds: number) => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

const newCycleFormValidationSchema = zod.object({
   task: zod.string().min(1, 'Informe a tarefa'),
   minutesAmount: zod.number()
      .min(5, 'O ciclo precisa ser de no mínimo 5 minutos')
      .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})

// interface NewCycleFormData {
//    task: string;
//    minutesAmount: number;
// } A FORMA DE BAIXO TAMBEM FUNCIONA, MAS É USANDO ZOD

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
   const [cycles, setCycles] = useState<Cycle[]>([]);
   const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
   const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

   // register cria e da propriedades ao input e rrecebe o nome dele como parametro em string / handleSubmit recebe uma função handle como arg e devolve em data os dados recebidos dos campos do form ao realizar o submit / watch observa algum campo e mantem seu valor atualizado / formState guarda um valor de errors para gerar mensagens de erro na validação.
   const newCycleForm = useForm<NewCycleFormData>({
      resolver: zodResolver(newCycleFormValidationSchema),
      defaultValues: {
         task: '',
         minutesAmount: 0,
      }
   });

   const { handleSubmit, watch, reset } = newCycleForm

   const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

   function setSecondsPassed(seconds: number) {
      setAmountSecondsPassed(seconds)
   }

   function markCurrentCycleAsFinished() {
      setCycles(state => state.map(cycle => {
         if (cycle.id === activeCycleId) {
            return { ...cycle, finishedDate: new Date() }
         } else {
            return cycle;
         }
      }));
   }

   function handleCreateNewCycle(data: NewCycleFormData) {
      const newCycle: Cycle = {
         id: String(new Date().getTime()),
         task: data.task,
         minutesAmount: data.minutesAmount,
         startDate: new Date(),
      }

      setCycles((state) => [...state, newCycle]); //É o mesmo que setCycles([...cycles, newCycle]) só que mais performatico. Sempre que uma auteração de estado depende do valor anterior e bom fazer assim
      setActiveCycleId(newCycle.id);
      setAmountSecondsPassed(0);

      reset(); //ele reseta os valores do input pro valor padrao definidos no defaultValues do useForm acima.
   }

   function handleInterrupCycle() {
      setCycles(state => state.map(cycle => {
         if (cycle.id === activeCycleId) {
            return { ...cycle, interruptedDate: new Date() }
         } else {
            return cycle;
         }
      }));

      setActiveCycleId(null);
   }

   const task = watch('task');
   const isSubmitDisabled = !task;

   return (
      <HomeContainer>
         <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
            <CyclesContext.Provider value={{ activeCycle, activeCycleId, markCurrentCycleAsFinished, amountSecondsPassed, setSecondsPassed }}>
               <FormProvider {...newCycleForm}>
                  <NewCycleForm />
               </FormProvider>
               <Countdown />
            </CyclesContext.Provider>

            {activeCycle ? (
               <StopCountdownButton onClick={handleInterrupCycle} type="button">
                  <HandPalm size={24} />
                  Interromper
               </StopCountdownButton>
            ) : (
               <StartCountdownButton disabled={isSubmitDisabled} type="submit">
                  <Play size={24} />
                  Começar
               </StartCountdownButton>
            )}
         </form>
      </HomeContainer>
   );
}