import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const CountryInfo = () => {
  const { code } = useParams()
  const [countryInfo, setCountryInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCountryInfo = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/info/${code}`
        )
        setCountryInfo(response.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCountryInfo()
  }, [code])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  console.log('Country Data:', countryInfo)

  const populationData = {
    labels: countryInfo.populationData?.years || [],
    datasets: [
      {
        label: 'Population',
        data: countryInfo.populationData?.values || [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  }

  const countryName =
    countryInfo.populationData?.countryName || 'Unknown Country'

  return (
    <div className="container">
      <h2>{countryName}</h2>
      <img
        src={countryInfo.flagUrl || 'placeholder-image-url'}
        alt={`${countryInfo.name} flag`}
        style={{ width: '100px', marginBottom: '20px' }}
      />

      <h3>Border Countries</h3>
      <ul className="list-group">
        {countryInfo.borders && countryInfo.borders.length > 0 ? (
          countryInfo.borders.map((borderCountry) => (
            <li className="list-group-item" key={borderCountry.countryCode}>
              <Link to={`/country/${borderCountry.countryCode}`}>
                {borderCountry.commonName}
              </Link>
            </li>
          ))
        ) : (
          <li className="list-group-item">No border countries available.</li>
        )}
      </ul>

      <h3>Population Over Time</h3>
      {populationData.labels.length > 0 ? (
        <Bar data={populationData} />
      ) : (
        <p>No population data available.</p>
      )}
    </div>
  )
}

export default CountryInfo
