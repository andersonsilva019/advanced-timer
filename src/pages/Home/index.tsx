import { useState, createContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { HandPalm, Play } from "phosphor-react";
import { zodResolver } from "@hookform/resolvers/zod"
import * as zod from "zod"

import { NewCycleForm } from "./NewCycleForm";
import { Countdown } from "./Countdown";

import * as S from './styles'
type StatusTimer = 'interrupted' | 'finished'

type Cycle = {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

type CycleContextType = {
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  controlStateTimer: (status: StatusTimer) => void
  amountSecondsPassed: number
  setSecondsPassed: (seconds: number) => void
}

const cycleContextInitialValue: CycleContextType = {
  activeCycle: undefined,
  activeCycleId: null,
  controlStateTimer: () => null,
  amountSecondsPassed: 0,
  setSecondsPassed: () => null
}

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number()
    .min(1, 'O ciclo precisa ser de no mínimo 5 minutos')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export const CycleContext = createContext(cycleContextInitialValue);

export function Home() {

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 5,
    }
  });

  const { handleSubmit, reset, watch } = newCycleForm

  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

  const task = watch('task');
  const isDisabledButton = !task;


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

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  return (
    <S.HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>

        <CycleContext.Provider value={{
          activeCycle,
          activeCycleId,
          controlStateTimer,
          amountSecondsPassed,
          setSecondsPassed
        }}>
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <Countdown />
        </CycleContext.Provider>

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