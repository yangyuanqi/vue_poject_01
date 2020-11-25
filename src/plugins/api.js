import axios from 'axios'

export default async(url = '', data = {}, type = 'GET') => {
  if (type === 'GET') {
    const { data: res } = await axios.get(url, {
      params: data
    })
    return res
  }
  if (type === 'POST') {
    const { data: res } = await axios.post(url, data)
    return res
  }
  if (type === 'PUT') {
    const { data: res } = await axios.put(url, data)
    return res
  }
  if (type === 'DELETE') {
    const { data: res } = await axios.delete(url)
    return res
  }
}
