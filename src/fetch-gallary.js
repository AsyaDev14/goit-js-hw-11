import axios from "axios";

const BASE_URL = 'https://pixabay.com/api/'
const MY_KEY = '33816653-3cca4f3926f281165d337bdaa';

export const fetchGallery = async (value, page) => {
  const res = await axios.get(`${BASE_URL}?key=${MY_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=5&page=${page}`);
  console.log("res", res);
  return res.data;
}