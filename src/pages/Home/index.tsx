import { useEffect, useState } from "react";
import { HandPalm, Play } from "phosphor-react";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { differenceInSeconds } from 'date-fns'
import * as zod from 'zod'

import * as S from './styles'
import { NewCycleForm } from "./NewCycleForm";
import { Countdown } from "./Countdown";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number()
    .min(1, 'O ciclo precisa ser de no mínimo 5 minutos')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})

type StatusTimer = 'interrupted' | 'finished'

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

type Cycle = {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

export function Home() {

  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { register, handleSubmit, watch, /*formState*/ reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 5,
    }
  });
  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

  const task = watch('task');
  const isDisabledButton = !task;

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = minutesAmount < 10 ? `0${minutesAmount}` : `${minutesAmount}`
  const seconds = secondsAmount < 10 ? `0${secondsAmount}` : `${secondsAmount}`

  //console.log(formState.errors);

  function controlStateTimer(status: StatusTimer) {

    const statusTimer = {
      interrupted: 'interruptedDate',
      finished: 'finishedDate',
    }

    setCycles(state => state.map(cycle => {
      if (cycle.id === activeCycleId) {
        return { ...cycle, [statusTimer[status]]: new Date() }
      } else {
        return cycle
      }
    }))
  }

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {

        const secondsDiff = differenceInSeconds(new Date(), activeCycle.startDate)

        if (secondsDiff >= totalSeconds) {

          controlStateTimer('finished');

          clearInterval(interval);

          setAmountSecondsPassed(totalSeconds);

        } else {
          setAmountSecondsPassed(secondsDiff)
        }

      }, 1000)
    }
    return () => clearInterval(interval)
  }, [activeCycle, totalSeconds, controlStateTimer]);

  useEffect(() => {
    if (activeCycle) {
      document.title = `${activeCycle.task} - ${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle]);

  function handleCreateNewCycle(data: NewCycleFormData) {

    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date()
    }

    setCycles(state => [...state, newCycle]);
    setActiveCycleId(newCycle.id);
    setAmountSecondsPassed(0);

    reset();
  }

  function handleInterruptCycle() {
    setActiveCycleId(null);
    setAmountSecondsPassed(0);

    controlStateTimer('interrupted');
  }

  return (
    <S.HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>

        <NewCycleForm />

        <Countdown />

        {activeCycle ? (
          <S.StopCountdownButton onClick={handleInterruptCycle}>
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