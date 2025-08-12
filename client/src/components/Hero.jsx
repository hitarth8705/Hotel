import React,{useEffect} from 'react';
import { assets, cities } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Hero = () => {
  const {
    getToken,
    axios,
    setSearchedCities
  } = useAppContext();

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const destination = searchParams.get('destination') || '';
  const checkInDate = searchParams.get('checkInDate') || '';
  const checkOutDate = searchParams.get('checkOutDate') || '';
  const guests = searchParams.get('guests') || 1;

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set(key, value);
    setSearchParams(newParams);
  };

  const onSearch = async (e) => {
    e.preventDefault();

    if (!destination || !checkInDate || !checkOutDate || new Date(checkInDate) >= new Date(checkOutDate)) {
      alert("Please fill all fields correctly.");
      return;
    }

    navigate(`/rooms?destination=${destination}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&guests=${guests}`);

    await axios.post('/api/user/store-recent-search', {
      recentSearchedCity: destination
    }, {
      headers: { Authorization: `Bearer ${await getToken()}` }
    });

    setSearchedCities((prev) => {
      const updated = [...prev, destination];
      if (updated.length > 3) updated.shift();
      return updated;
    });
  };

  useEffect(() => {
    // clear URL params when Hero page loads
    setSearchParams({});
  }, []);
  scrollTo(0, 0);

  return (
    <div className="flex flex-col items-start justify-center px-6 md-px-16 lg:px-24 xl:px-32 text-white bg-[url('/heroimage2.png')] bg-cover bg-center bg-no-repeat h-screen">
      
      <p className='bg-[#49b9ff]/50 px-3.5 py-1 rounded-full mt-20'>The Ultimate Hotel Experience</p>
      <h1 className='font-playfair text-2xl md:text-5xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-xl mt-4'>Discover Your Perfect Gateway Destination</h1>
      <p className='max-w-130 mt-2 text-sm md:text-base'>Unparalleled luxury and comfort await at the world's most exclusive hotels and resorts. Start your journey today.</p>

      <form onSubmit={onSearch} className='bg-white text-gray-500 rounded-lg px-6 py-4 mt-8 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto'>

        {/* Destination */}
        <div>
          <div className='flex items-center gap-2'>
            <img src={assets.calenderIcon} alt="" className='h-4' />
            <label htmlFor="destinationInput">Destination</label>
          </div>
          <input
            onChange={(e) => updateParam('destination', e.target.value)}
            value={destination}
            list='destinations'
            id="destinationInput"
            type="text"
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
            placeholder="Type here"
            required
          />
          <datalist id='destinations'>
            {cities.map((city, i) => <option key={i} value={city} />)}
          </datalist>
        </div>

        {/* Check-In */}
        <div>
          <div className='flex items-center gap-2'>
            <img src={assets.calenderIcon} alt="" className='h-4' />
            <label htmlFor="checkInDate">Check in</label>
          </div>
          <input
            id="checkInDate"
            value={checkInDate}
            onChange={(e) => updateParam('checkInDate', e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            type="date"
            required
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
          />
        </div>

        {/* Check-Out */}
        <div>
          <div className='flex items-center gap-2'>
            <img src={assets.calenderIcon} alt="" className='h-4' />
            <label htmlFor="checkOutDate">Check out</label>
          </div>
          <input
            id="checkOutDate"
            value={checkOutDate}
            onChange={(e) => updateParam('checkOutDate', e.target.value)}
            min={checkInDate}
            disabled={!checkInDate}
            type="date"
            required
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
          />
        </div>

        {/* Guests */}
        <div className='flex md:flex-col max-md:gap-2 max-md:items-center'>
          <label htmlFor="guests">Guests</label>
          <input
            name="guests"
            value={guests}
            onChange={(e) => updateParam('guests', e.target.value)}
            type="number"
            required
            id='guests'
            placeholder='1'
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none max-w-16"
          />
        </div>

        {/* Search */}
        <button className='flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1'>
          <img src={assets.searchIcon} alt="searchIcon" className='h-7' />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
};

export default Hero;


