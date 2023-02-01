import React, { useEffect, useRef } from 'react'
import $ from 'jquery'

export const Notice = (props: any) => {
  let timerID: any
  const addiche: any = useRef<any>(null)
  const text: any = useRef<any>(null)

  useEffect(() => {
    if (props.value) {
      const scrollWidth: any = $(addiche.current).width()
      const textWidth: any = $(text.current).width()
      let i: any = scrollWidth
      timerID = setInterval(function() {
        i--
        if (i < -textWidth) {
          i = scrollWidth
        }
        $(text.current).animate({'left': i + 'px'}, 10)
      }, 10)
    }
    return () => {
      clearInterval(timerID)
    }
  }, [props.value])

  return (
    <div ref={addiche} className={'affiche'}>
      <div ref={text} className={'affiche_text'}>
        {props.value}
      </div>
    </div>
  )
}

