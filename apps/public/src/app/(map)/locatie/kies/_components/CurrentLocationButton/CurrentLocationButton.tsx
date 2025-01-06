import type { ButtonProps } from '@amsterdam/design-system-react'
import { Button } from '@amsterdam/design-system-react'

type Props = {
  setNotification: (notification: { heading: string; description: string } | null) => void
} & ButtonProps

export const CurrentLocationButton = ({ setNotification, ...restProps }: Props) => {
  const onSuccess = () => console.log('success')

  const onError = () => {
    setNotification({
      heading: 'meldingen.amsterdam.nl heeft geen toestemming om uw locatie te gebruiken.',
      description: 'Dit kunt u wijzigen in de voorkeuren of instellingen van uw browser of systeem.',
    })
  }

  const handleClick = () => {
    navigator.geolocation.getCurrentPosition(onSuccess, onError)
  }

  return <Button {...restProps} variant="secondary" onClick={handleClick} />
}
