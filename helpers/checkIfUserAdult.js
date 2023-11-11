const isUserAdult = (date) => {
  const today = new Date();
  const birthDate = new Date(date);
  const age = today.getFullYear() - birthDate.getFullYear();

  // if (
  //   today.getMonth() < birthDate.getMonth() ||
  //   (today.getMonth() === birthDate.getMonth() &&
  //     today.getDate() < birthDate.getDate())
  // ) {
  //   return age - 1;
  // }

  if (age >= 18) {
    return true;
  }

  return false;
};

module.exports = {
  isUserAdult,
};
