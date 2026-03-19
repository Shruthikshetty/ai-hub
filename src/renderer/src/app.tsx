import { useEffect, useState } from 'react'
import { EXAMPLE_DATA } from '@common/constants/global.constants'
import Versions from './components/Versions'

function App(): React.JSX.Element {
  // get data from worker
  const [data, setData] = useState<typeof EXAMPLE_DATA | null>(null)

  // fetch data
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const result = await window.api.request('/api/profile', 'GET')
        setData(result.data)
      } catch (error) {
        console.error('Failed to fetch profile from Hono worker:', error)
      }
    }

    fetchData()
  }, [])
  return (
    <div className="flex flex-col h-screen w-screen justify-center items-center bg-gray-300">
      <h1 className="text-2xl font-bold mb-2">Hello</h1>
      {data ? (
        <div className="m-4">
          <p>Name: {data.name}</p>
          <p>Age: {data.age}</p>
          <p>City: {data.city}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mb-2"
        onClick={async () => {
          const res = await window.api.request('/api/profile', 'PATCH', {
            name: 'Jane Doe',
            age: 55,
            city: 'London'
          })
          console.log(res)
          setData(res.data)
        }}
      >
        Update Profile (PATCH)
      </button>
      <Versions />
    </div>
  )
}

export default App
