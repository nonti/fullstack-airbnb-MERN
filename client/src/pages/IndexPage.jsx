import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const IndexPage = () => {
  const [places, setPlaces] = useState([])
  useEffect(() => {
    axios.get('/places').then(response =>{
      setPlaces(response.data);
    })
  }, [])
  return (
    <div className='mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-6'>
      {places.length > 0 && places.map(place =>(
        <Link to={'/place/' +place._id} key={place}>
          <div className='mb-2 bg-gray-500 rounded-2xl flex object-cover aspect-square'>
          {place.photos?.[0] && (
            <img className='rounded-2xl' src={'http://localhost:4001/uploads/'+place.photos?.[0]} alt='photos' />
          )}
          </div>
          <h2 className="font-bold">{place.title}</h2>
          <h3 className="text-sm text-gray-500">{place.address}</h3>
          <div className="mt-1">
            <span className="font-bold">R{place.price}</span> per night
          </div>
          </Link>
      ))}
      
    </div>
  )
}

export default IndexPage