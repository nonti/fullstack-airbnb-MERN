import { useEffect, useState } from 'react';
import Perks from '../Perks';
import PhotoUploaders from '../PhotoUploaders';
import axios from 'axios';
import AccountNav from '../AccountNav';
import { Navigate, useParams } from 'react-router-dom';

const PlacesFormPage = () => {
  const {id} = useParams();
  console.log(id)
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState('');
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if(!id){
      return;
    }
    axios.get('/places/'+ id).then(response => {
      const {data} = response;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    })
  }, [id])
  const preInput = (header, description) => {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  };

  const savePlace = async (e) => {
    e.preventDefault();
    const place_data = {
      title, address, description, 
      extraInfo, perks, addedPhotos,
       checkIn, checkOut, maxGuests,price,
    }
    if(id) {
      //update
      await axios.put('/places',{
        id,
        ...place_data
      });
      setRedirect(true);
    }else{
      await axios.post('/places', place_data);
      setRedirect(true);
    }
   
  };

  if(redirect){
    return <Navigate to={'/account/places'}/>
  }

  const inputHeader = (text) => {
    return (
      <h2 className='text-2xl mt4'>{text}</h2>
    );
  };

  const inputDescription = (text) => {
    return (
      <p className='text-gray-500 text-sm'>{text}</p>
    );
  };
  return (
    <>
    <AccountNav />
      <form onSubmit={savePlace}>
            {preInput('Title', 'Title for your place should be short and catchy as in advertisement')}
            <input
              type='text'
              placeholder='title for example: my lovely apartment'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {preInput('Address','Address to your places')}
            <input 
              type='text' 
              placeholder='address' 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              />
            {preInput('Photos', 'more = better')}
            <PhotoUploaders addedPhotos={addedPhotos} onChange={setAddedPhotos} />
            {preInput('Description','description of the place')}
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {preInput('Perks','Select all the perks')}
            <div className='grid mt-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6'>
              <Perks selected={perks} onChange={setPerks}/>
            </div>
            {preInput('Extra info','house rules etc')}
            <textarea 
              value={extraInfo}
              onChange={(e) => setExtraInfo(e.target.value)}
            />
            {preInput('Check in&out times, max guests','Add check in and out times remember to have some time window for claening the room between guests')}
            <div className='grid gap-2 sm:grid-cols-2 md:grid-cols-4' >
              <div> 
                <h3 className='mt-2 -mb-1'>Check in time</h3>
              <input 
                type='text' 
                placeholder='14' 
                value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>
              <div> 
                <h3 className='mt-2 -mb-1'>Check out time</h3>
              <input 
                type='text' 
                placeholder='11' 
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)} />

              </div>
              <div> 
                <h3 className='mt-2 -mb-1'>Max number of guests</h3>
              <input 
                type='number' 
                placeholder='Max guests' 
                value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
                />
              </div>
              <div> 
                <h3 className='mt-2 -mb-1'>Price per night</h3>
              <input 
                type='number' 
                placeholder='Price per night' 
                value={price}
              onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
              <button className='primary my-4'>Save</button>
          </form>
    </>
  )
}

export default PlacesFormPage