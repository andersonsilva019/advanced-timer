import { useContext } from 'react'
import { differenceInSeconds } from 'date-fns';
import { useEffect, useState } from 'react'
import { CycleContext } from '..';

import * as S from './styles'

export function Countdown() {

  const {
    activeCycle,
    controlStateTimer,
    amountSecondsPassed,
    setSecondsPassed
  } = useContext(CycleContext)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)

  const secondsAmount = currentSeconds % 60

  const minutes = minutesAmount < 10 ? `0${minutesAmount}` : `${minutesAmount}`

  const seconds = secondsAmount < 10 ? `0${secondsAmount}` : `${secondsAmount}`

  useEffect(() => {
    if (activeCycle) {
      document.title = `${activeCycle.task} - ${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle]);

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {

        const secondsDiff = differenceInSeconds(new Date(), activeCycle.startDate)

        if (secondsDiff >= totalSeconds) {

          controlStateTimer('finished');

          clearInterval(interval);

          setSecondsPassed(totalSeconds);

        } else {
          setSecondsPassed(secondsDiff)
        }

      }, 1000)
    }
    return () => clearInterval(interval)
  }, [activeCycle, totalSeconds, controlStateTimer]);

  return (
    <S.CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <S.Separator>:</S.Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </S.CountdownContainer>

  )
}