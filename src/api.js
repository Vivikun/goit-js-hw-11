import axios from 'axios';

const apiKey = '39883816-7d1852f26e33bbb727bc03d19';
const perPage = 40;

export async function searchImages(query, page) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: apiKey,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: perPage,
        page: page,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}
