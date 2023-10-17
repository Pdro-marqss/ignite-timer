import { useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';

import { HandPalm, Play } from 'phosphor-react';
import { HomeContainer, StartCountdownButton, StopCountdownButton } from './styles';

import { NewCycleForm } from './components/NewCycleForm';
import { Countdown } from './components/Countdown';
import { CyclesContext } from '../../contexts/CyclesContext';

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
   const { activeCycle, createNewCycle, interruptCurrentCycle } = useContext(CyclesContext)

   // register cria e da propriedades ao input e rrecebe o nome dele como parametro em string / handleSubmit recebe uma função handle como arg e devolve em data os dados recebidos dos campos do form ao realizar o submit / watch observa algum campo e mantem seu valor atualizado / formState guarda um valor de errors para gerar mensagens de erro na validação.
   const newCycleForm = useForm<NewCycleFormData>({
      resolver: zodResolver(newCycleFormValidationSchema),
      defaultValues: {
         task: '',
         minutesAmount: 0,
      }
   });

   const { handleSubmit, watch, reset } = newCycleForm

   function handleCreateNewCycle(data: NewCycleFormData) {
      createNewCycle(data);
      reset(); //ele reseta os valores do input pro valor padrao definidos no defaultValues do useForm acima.
   }

   const task = watch('task');
   const isSubmitDisabled = !task;

   return (
      <HomeContainer>
         <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
            <FormProvider {...newCycleForm}>
               <NewCycleForm />
            </FormProvider>
            <Countdown />

            {activeCycle ? (
               <StopCountdownButton onClick={interruptCurrentCycle} type="button">
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