import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const CountryList = () => {
  const [countries, setCountries] = useState([])

  useEffect(() => {
    const fetchCountries = async () => {
      const url = `${process.env.REACT_APP_API_BASE_URL}/available-countries`
      console.log('Fetching countries from:', url)
      try {
        const response = await axios.get(url)
        console.log('Countries response:', response.data)

        const countriesData = response.data.data || [] // Fallback to an empty array if undefined
        setCountries(countriesData)
      } catch (error) {
        console.error('Error fetching countries:', error)
      }
    }

    fetchCountries()
  }, [])

  return (
    <div>
      <h2>Available Countries</h2>
      <ul className="list-group">
        {Array.isArray(countries) && countries.length > 0 ? (
          countries.map((country) => {
            console.log('Country:', country)
            const countryCode = country.iso2 || 'unknown'

            return (
              <li className="list-group-item" key={countryCode}>
                <Link to={`/country/${countryCode}`}>{country.country}</Link>
              </li>
            )
          })
        ) : (
          <li className="list-group-item">No countries available.</li>
        )}
      </ul>
    </div>
  )
}

export default CountryList
