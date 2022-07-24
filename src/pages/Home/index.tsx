import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { HandPalm, Play } from "phosphor-react";
import { zodResolver } from "@hookform/resolvers/zod"
import * as zod from "zod"

import { NewCycleForm } from "./NewCycleForm";
import { Countdown } from "./Countdown";

import { CycleContext } from "../../contexts/CycleContext";

import * as S from './styles'
export const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(5, 'Informe a tarefa'),
  minutesAmount: zod.number()
    .min(1, 'O ciclo precisa ser de no mínimo 5 minutos')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {

  const {
    activeCycle,
    createNewCycle,
    interruptCurrentCycle
  } = useContext(CycleContext)

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 5,
    }
  });

  const { handleSubmit, reset, watch } = newCycleForm

  const task = watch('task');
  const isDisabledButton = !task;

  return (
    <S.HomeContainer>
      <form onSubmit={handleSubmit(createNewCycle)}>

        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        {activeCycle ? (
          <S.StopCountdownButton onClick={interruptCurrentCycle}>
            <HandPalm size={24} />
            Interromper
          </S.StopCountdownButton>
        ) : (
          <S.StartCountdownButton disabled={isDisabledButton} type="submit">
            <Play size={24} />
            Começar
          </S.StartCountdownButton>
        )}
      </form>
    </S.HomeContainer>
  )
}