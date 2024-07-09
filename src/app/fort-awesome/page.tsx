import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon, faSpinner, faCheckCircle, faCircle, faCircleDot } from '@fortawesome/free-solid-svg-icons'

export default function Page() {
  return (
    <main>
      <FontAwesomeIcon icon={faSun} />
      <FontAwesomeIcon icon={faMoon} />
      <FontAwesomeIcon icon={faSpinner} spin />
      <FontAwesomeIcon icon={faCheckCircle} color='#00ff00' />

      <FontAwesomeIcon icon={faCircle} />
      <FontAwesomeIcon icon={faCircleDot} color='#00ff00' />
    </main>
  )
}