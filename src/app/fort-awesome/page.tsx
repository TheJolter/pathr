import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon, faSpinner } from '@fortawesome/free-solid-svg-icons'

export default function Page() {
  return (
    <main>
      <FontAwesomeIcon icon={faSun} />
      <FontAwesomeIcon icon={faMoon} />
      <FontAwesomeIcon icon={faSpinner} spin />
    </main>
  )
}