export default class SearchImg {
  constructor() {
    this.name = '';
    this.page = 1;
  }
  fetchImgByName() {
    console.log(this);
    const BASE_URL = 'https://pixabay.com/api/';
    const searchParams = new URLSearchParams({
      key: '31392505-41b93051c6715e7012a1d9703',
      q: this.name,
      page: this.page,
      per_page: 10,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    });
    const url = `${BASE_URL}?${searchParams}`;
    return fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      this.page += 1;
      return response.json();
    });
  }
  get query() {
    return this.name;
  }
  set query(newName) {
    this.name = newName;
  }
}
