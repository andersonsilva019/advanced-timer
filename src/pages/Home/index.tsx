import { Play } from "phosphor-react";
import { useForm } from 'react-hook-form'

import * as S from './styles'

export function Home() {

  const { register, handleSubmit, watch } = useForm();

  const task = watch('task');
  const isDisabledButton = !task;

  function handleCreateNewCycle(data) {
    console.log(data);
  }


  return (
    <S.HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <S.FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <S.TaskInput
            id="task"
            type="text"
            placeholder="Dê um nome para o seu projeto"
            list="task-suggestions"
            {...register('task')}
          />

          <datalist id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
          </datalist>

          <label htmlFor="minutesAmount">Durante</label>
          <S.MinutesAmountInput
            id="minutesAmount"
            type="number"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>Minutos.</span>
        </S.FormContainer>

        <S.CountdownContainer>
          <span>0</span>
          <span>0</span>
          <S.Separator>:</S.Separator>
          <span>0</span>
          <span>0</span>
        </S.CountdownContainer>

        <S.StartCountdownButton disabled={isDisabledButton} type="submit">
          <Play size={24} />
          Começar
        </S.StartCountdownButton>
      </form>
    </S.HomeContainer>
  )
}