import { useForm } from 'react-hook-form';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { FormContainer, MinutesAmountInput, TaskInput } from './styles';


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


export function NewCycleForm() {
   // register cria e da propriedades ao input e rrecebe o nome dele como parametro em string / handleSubmit recebe uma função handle como arg e devolve em data os dados recebidos dos campos do form ao realizar o submit / watch observa algum campo e mantem seu valor atualizado / formState guarda um valor de errors para gerar mensagens de erro na validação.
   const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
      resolver: zodResolver(newCycleFormValidationSchema),
      defaultValues: {
         task: '',
         minutesAmount: 0,
      }
   });

   return (
      <FormContainer>
         <label htmlFor="task">Vou trabalhar em</label>
         <TaskInput
            id="task"
            list='task-suggestions'
            placeholder='De um nome para o seu projeto'
            disabled={!!activeCycle}
            {...register('task')}
         />
         <datalist id='task-suggestions'>
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
            <option value="League of legends" />
         </datalist>

         <label htmlFor="minutesAmount">durante</label>
         <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder='00'
            step={5}
            min={5}
            max={60}
            disabled={!!activeCycle}
            {...register('minutesAmount', { valueAsNumber: true })}
         />

         <span>minutos.</span>
      </FormContainer>
   );
}