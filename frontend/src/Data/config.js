const domain = document.domain;

export const base_url = (domain === 'localhost') ? `http://localhost:3000` : 'https://dharitri.herokuapp.com';