import { StoreKey } from '@/constant';
const widthToken = () => {
  const person = localStorage.getItem(StoreKey.Person);
  let token;
  try {
    if (person) {
      const _person = JSON.parse(person);
      if (_person?.state?.token) {
        token = `Bearer ${_person?.state?.token}`;
      }
    }
    // eslint-disable-next-line no-empty
  } catch (error) {}
  return token;
};

export default widthToken;
