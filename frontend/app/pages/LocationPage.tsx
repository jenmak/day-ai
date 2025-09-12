import { useParams } from "react-router"

export function Location() {
  const { slug } = useParams()
  return (
    <div>
      <h1>Location Page {slug}</h1>
    </div>
  )
}