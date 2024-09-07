const domain = document.domain;

export const base_url = (domain === 'localhost') ? `http://localhost:5050` : 'https://dharitri.herokuapp.com';